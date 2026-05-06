/**
 * ================================================
 *  DÉIA ART LAÇOS — Google Apps Script Web App
 *  Banco de Dados via Google Sheets
 * ================================================
 *
 * INSTRUÇÕES DE DEPLOY:
 * 1. Abra sua planilha no Google Sheets
 * 2. Clique em Extensões > Apps Script
 * 3. Apague o código padrão e cole TODO este arquivo
 * 4. Salve (Ctrl+S) e clique em "Implantar > Nova implantação"
 * 5. Tipo: Web App | Executar como: Eu | Acesso: Qualquer pessoa
 * 6. Copie a URL gerada e coloque em src/lib/sheets.ts (SHEET_URL)
 *
 * ESTRUTURA DAS ABAS:
 * - Produtos:      id | name | description | price | category | image | likes | isNew | isBestSeller | createdAt
 * - Usuarios:      uid | email | password | displayName | role | photoURL | createdAt
 * - Favoritos:     userId | productId | addedAt
 * - Configuracoes: key | value | updatedAt
 */

// ─── Token de segurança para escrita ───────────────────────────────────────
// TROQUE ESTE VALOR por uma string secreta de sua escolha antes de publicar!
var WRITE_TOKEN = "AKfycbxwKlKBJLzfGNDn3-NlSwOCgDNMDXNXtBDj-AlujV-smuoBOW696kbeR1jG-KNICg";
var DRIVE_FOLDER_ID = "1Z4Wkt_Vx53Y52krQl5s4nefUV7_c5bjI";

// ─── Nomes das abas ─────────────────────────────────────────────────────────
var SHEET_PRODUCTS     = "Produtos";
var SHEET_USERS        = "Usuarios";
var SHEET_FAVORITES    = "Favoritos";
var SHEET_SETTINGS     = "Configuracoes";
var SHEET_ORDERS       = "Pedidos";
var USER_HEADERS       = ["uid","email","password","displayName","role","photoURL","whatsapp","cep","cidade","endereco","numero","complemento","estado","createdAt"];

// ─── Inicializa abas se não existirem ───────────────────────────────────────
function initSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  function ensureSheet(name, headers) {
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    } else {
      // Verifica se faltam colunas e adiciona se necessário
      var lastCol = sheet.getLastColumn();
      var currentHeaders = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
      for (var i = 0; i < headers.length; i++) {
        var headerName = headers[i];
        var found = false;
        for (var j = 0; j < currentHeaders.length; j++) {
          if (currentHeaders[j] === headerName) {
            found = true;
            break;
          }
        }
        if (!found) {
          sheet.getRange(1, sheet.getLastColumn() + 1).setValue(headerName).setFontWeight("bold");
          currentHeaders.push(headerName);
        }
      }
    }
    return sheet;
  }

  ensureSheet(SHEET_PRODUCTS,  ["id","name","description","price","category","size","type","image","likes","isNew","isBestSeller","createdAt"]);
  ensureSheet(SHEET_USERS,     USER_HEADERS);
  ensureSheet(SHEET_FAVORITES, ["userId","productId","addedAt"]);
  ensureSheet(SHEET_SETTINGS,  ["key","value","updatedAt"]);
  ensureSheet(SHEET_ORDERS,    ["id","userId","date","items","total","status","paymentMethod"]);
}

// ─── GET handler ─────────────────────────────────────────────────────────────
function doGet(e) {
  initSheets();
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    var action = e.parameter.action || "ping";
    var data   = {};

    switch (action) {
      case "ping":
        data = { status: "ok", message: "Déia Art Laços API running" };
        break;

      case "getProducts":
        data = { products: readSheet(SHEET_PRODUCTS) };
        break;

      case "getUsers":
        data = { users: readSheet(SHEET_USERS) };
        break;

      case "getFavorites":
        var userId = e.parameter.userId;
        if (!userId) throw new Error("userId required");
        var favs = readSheet(SHEET_FAVORITES).filter(function(r) {
          return r.userId === userId;
        });
        data = { favorites: favs };
        break;

      case "getOrders":
        var userId2 = e.parameter.userId;
        if (!userId2) throw new Error("userId required");
        var orders = readSheet(SHEET_ORDERS).filter(function(r) {
          return r.userId === userId2;
        }).sort(function(a, b) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        data = { orders: orders };
        break;

      case "getSettings":
        var settings = {};
        readSheet(SHEET_SETTINGS).forEach(function(r) {
          settings[r.key] = r.value;
        });
        data = { settings: settings };
        break;

      default:
        data = { error: "Unknown action: " + action };
    }

    output.setContent(JSON.stringify(data));
  } catch (err) {
    output.setContent(JSON.stringify({ error: err.toString() }));
  }

  return output;
}

// ─── POST handler ────────────────────────────────────────────────────────────
function doPost(e) {
  initSheets();
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    var token  = body.token;

    // Validate write token for all mutations
    if (token !== WRITE_TOKEN) {
      output.setContent(JSON.stringify({ error: "Unauthorized" }));
      return output;
    }

    var data = {};

    switch (action) {
      // ── PRODUCTS ──────────────────────────────────────────────────────────
      case "addProduct":
        var product = body.product;
        product.id = generateId();
        product.createdAt = new Date().toISOString();
        product.likes = product.likes || 0;
        appendRow(SHEET_PRODUCTS, product, ["id","name","description","price","category","size","type","image","likes","isNew","isBestSeller","createdAt"]);
        data = { id: product.id, success: true };
        break;

      case "updateProduct":
        var updated = body.product;
        updateRow(SHEET_PRODUCTS, "id", updated.id, updated, ["id","name","description","price","category","size","type","image","likes","isNew","isBestSeller","createdAt"]);
        data = { success: true };
        break;

      case "deleteProduct":
        deleteRow(SHEET_PRODUCTS, "id", body.id);
        data = { success: true };
        break;

      // ── USERS ─────────────────────────────────────────────────────────────
      case "login":
        var email = body.email.toLowerCase();
        var pass  = body.password;
        var allUsers = readSheet(SHEET_USERS);
        var found = allUsers.find(function(u) {
          return String(u.email).toLowerCase() === email && String(u.password) === pass;
        });

        if (found) {
          // Remove password from response for safety
          var userCopy = JSON.parse(JSON.stringify(found));
          delete userCopy.password;
          data = { success: true, user: userCopy };
        } else {
          data = { success: false, error: "E-mail ou senha inválidos" };
        }
        break;

      case "register":
        var newUser = body.user;
        newUser.uid = newUser.uid || generateId();
        newUser.email = newUser.email.toLowerCase();
        newUser.createdAt = newUser.createdAt || new Date().toISOString();
        newUser.role = newUser.role || "customer";

        // Check if email already exists
        var existing = readSheet(SHEET_USERS).find(function(u) {
          return String(u.email).toLowerCase() === newUser.email;
        });

        if (existing) {
          data = { success: false, error: "Este e-mail já está cadastrado" };
        } else {
          appendRow(SHEET_USERS, newUser, USER_HEADERS);
          var userCopy = JSON.parse(JSON.stringify(newUser));
          delete userCopy.password;
          data = { success: true, user: userCopy };
        }
        break;

      case "upsertUser":
        var user = body.user;
        user.createdAt = user.createdAt || new Date().toISOString();
        upsertRow(SHEET_USERS, "uid", user.uid, user, USER_HEADERS);
        data = { success: true };
        break;

      case "updateUserRole":
        updateRow(SHEET_USERS, "uid", body.uid, { role: body.role }, USER_HEADERS);
        data = { success: true };
        break;

      case "getUser":
        // Allow reading a single user without strict auth (caller passes their own uid)
        var users = readSheet(SHEET_USERS);
        var found = users.find(function(u) { return u.uid === body.uid; });
        data = { user: found || null };
        break;

      // ── FAVORITES ─────────────────────────────────────────────────────────
      case "addFavorite":
        var fav = { userId: body.userId, productId: body.productId, addedAt: new Date().toISOString() };
        appendRow(SHEET_FAVORITES, fav, ["userId","productId","addedAt"]);
        data = { success: true };
        break;

      case "removeFavorite":
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_FAVORITES);
        var rows  = sheet.getDataRange().getValues();
        var headers = rows[0];
        var userIdIdx   = headers.indexOf("userId");
        var productIdIdx = headers.indexOf("productId");
        for (var i = rows.length - 1; i >= 1; i--) {
          if (rows[i][userIdIdx] === body.userId && rows[i][productIdIdx] === body.productId) {
            sheet.deleteRow(i + 1);
            break;
          }
        }
        data = { success: true };
        break;

      // ── SETTINGS ──────────────────────────────────────────────────────────
      case "updateSetting":
        var setting = { key: body.key, value: body.value, updatedAt: new Date().toISOString() };
        upsertRow(SHEET_SETTINGS, "key", body.key, setting, ["key","value","updatedAt"]);
        data = { success: true };
        break;

      case "addOrder":
        var order = body.order;
        order.id = generateId();
        order.date = order.date || new Date().toISOString();
        // Converte items para string para salvar no Sheets em uma única célula
        order.items = typeof order.items === 'string' ? order.items : JSON.stringify(order.items);
        appendRow(SHEET_ORDERS, order, ["id","userId","date","items","total","status","paymentMethod"]);
        data = { id: order.id, success: true };
        break;

      case "uploadFile":
        var fileData = body.file; // base64 string
        var fileName = body.fileName;
        var mimeType = body.mimeType;
        
        var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
        var decoded = Utilities.base64Decode(fileData.split(",")[1]);
        var blob = Utilities.newBlob(decoded, mimeType, fileName);
        var file = folder.createFile(blob);
        
        // Set public permissions
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        var fileId = file.getId();
        console.log("Arquivo criado com ID: " + fileId + " e permissões públicas.");

        // Retorna link direto para imagens (thumbnail) ou link de stream para vídeos
        var finalUrl = "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w1000";
        if (mimeType.indexOf("video") !== -1) {
          finalUrl = "https://drive.google.com/uc?export=download&id=" + fileId;
        }

        data = { 
          success: true, 
          url: finalUrl
        };
        break;

      case "updateUser":
        var userUpdate = body.user;
        var uid = userUpdate.uid;
        if (!uid) throw new Error("uid required for update");
        
        upsertRow(SHEET_USERS, "uid", uid, userUpdate, USER_HEADERS);
        data = { success: true };
        break;

      default:
        data = { error: "Unknown action: " + action };
    }

    output.setContent(JSON.stringify(data));
  } catch (err) {
    output.setContent(JSON.stringify({ error: err.toString() }));
  }

  return output;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId() {
  return Utilities.getUuid().replace(/-/g, "").substring(0, 20);
}

function getSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    initSheets();
    sheet = ss.getSheetByName(name);
  }
  return sheet;
}

function readSheet(sheetName) {
  var sheet = getSheet(sheetName);
  var rows  = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];
  var headers = rows[0];
  return rows.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) {
      obj[h] = row[i];
    });
    return obj;
  });
}

function appendRow(sheetName, obj, headers) {
  var sheet = getSheet(sheetName);
  var row   = headers.map(function(h) { return obj[h] !== undefined ? obj[h] : ""; });
  sheet.appendRow(row);
}

function updateRow(sheetName, keyCol, keyVal, updates, headers) {
  var sheet    = getSheet(sheetName);
  var rows     = sheet.getDataRange().getValues();
  var hRow     = rows[0];
  var keyIdx   = hRow.indexOf(keyCol);

  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][keyIdx]) === String(keyVal)) {
      headers.forEach(function(h) {
        if (updates[h] !== undefined) {
          var colIdx = hRow.indexOf(h);
          if (colIdx >= 0) {
            sheet.getRange(i + 1, colIdx + 1).setValue(updates[h]);
          }
        }
      });
      break;
    }
  }
}

function upsertRow(sheetName, keyCol, keyVal, obj, headers) {
  var sheet    = getSheet(sheetName);
  var rows     = sheet.getDataRange().getValues();
  var hRow     = rows[0];
  var keyIdx   = hRow.indexOf(keyCol);
  var found    = false;

  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][keyIdx]) === String(keyVal)) {
      headers.forEach(function(h) {
        if (obj[h] !== undefined) {
          var colIdx = hRow.indexOf(h);
          if (colIdx >= 0) {
            sheet.getRange(i + 1, colIdx + 1).setValue(obj[h]);
          }
        }
      });
      found = true;
      break;
    }
  }

  if (!found) {
    appendRow(sheetName, obj, headers);
  }
}

function deleteRow(sheetName, keyCol, keyVal) {
  var sheet  = getSheet(sheetName);
  var rows   = sheet.getDataRange().getValues();
  var hRow   = rows[0];
  var keyIdx = hRow.indexOf(keyCol);

  for (var i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][keyIdx]) === String(keyVal)) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

/**
 * Utilitário para converter links antigos do Drive para o novo formato de miniatura.
 * Execute esta função apenas uma vez para consertar imagens existentes.
 */
function consertarLinksImagens() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Produtos");
  if (!sheet) return;
  
  var rows = sheet.getDataRange().getValues();
  var headers = rows[0];
  var imgIdx = headers.indexOf("image");
  if (imgIdx === -1) return;
  
  for (var i = 1; i < rows.length; i++) {
    var url = String(rows[i][imgIdx]);
    // Extrai o ID do link (funciona com vários formatos de link do Drive)
    var match = url.match(/id=([^&]+)/) || url.match(/\/d\/([^/]+)/);
    if (match && url.includes("google.com")) {
      var id = match[1];
      var newUrl = "https://drive.google.com/thumbnail?id=" + id + "&sz=w1000";
      sheet.getRange(i + 1, imgIdx + 1).setValue(newUrl);
    }
  }
  Logger.log("Links atualizados com sucesso!");
}
