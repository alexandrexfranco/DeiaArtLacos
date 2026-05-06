/**
 * sheets.ts — Cliente para o Google Apps Script Web App
 *
 * CONFIGURAÇÃO NECESSÁRIA:
 * 1. Siga as instruções em /google-apps-script/Code.gs para publicar o Web App
 * 2. Cole a URL gerada em SHEET_URL abaixo
 * 3. Defina o mesmo WRITE_TOKEN que está no Code.gs
 */

// ─── ⚙️ CONFIGURAÇÃO — Preencha após publicar o Apps Script ──────────────────
const SHEET_URL = import.meta.env.VITE_SHEET_URL || "";
const WRITE_TOKEN = import.meta.env.VITE_SHEET_TOKEN || "Qax8vGwOYKwLtXYaclDDo2XhUzM6LL7F73qGJH3v3jAyp6EoIcWwa9jRagrXHcMt";

// ─── Tipos ───────────────────────────────────────────────────────────────────
export interface SheetProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    size?: string;
    type?: string;
    image: string;
    likes: number;
    isNew: boolean;
    isBestSeller: boolean;
    createdAt: string;
}

export interface SheetUser {
    uid: string;
    email: string;
    password?: string;
    displayName: string;
    role: "admin" | "customer";
    photoURL?: string;
    whatsapp?: string;
    cep?: string;
    cidade?: string;
    endereco?: string;
    numero?: string;
    complemento?: string;
    estado?: string;
    createdAt: string;
}

export interface SheetFavorite {
    userId: string;
    productId: string;
    addedAt: string;
}

export interface SheetOrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
}

export interface SheetOrder {
    id: string;
    userId: string;
    date: string;
    items: SheetOrderItem[];
    total: number;
    status: string;
    paymentMethod: string;
}


// ─── Helper interno ──────────────────────────────────────────────────────────

function checkConfig() {
    if (!SHEET_URL) {
        throw new Error(
            "❌ VITE_SHEET_URL não configurada. Adicione ao arquivo .env na raiz do projeto."
        );
    }
}

async function sheetGet<T>(action: string, params: Record<string, string> = {}): Promise<T> {
    checkConfig();
    const query = new URLSearchParams({ action, ...params }).toString();
    const response = await fetch(`${SHEET_URL}?${query}`);
    if (!response.ok) throw new Error(`Sheets GET error: ${response.status}`);
    const json = await response.json();
    if (json.error) throw new Error(`Sheets error: ${json.error}`);
    return json as T;
}

async function sheetPost<T>(body: Record<string, unknown>): Promise<T> {
    checkConfig();
    const response = await fetch(SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" }, // Apps Script requer text/plain para evitar preflight CORS
        body: JSON.stringify({ ...body, token: WRITE_TOKEN }),
    });
    if (!response.ok) throw new Error(`Sheets POST error: ${response.status}`);
    const json = await response.json();
    if (json.error) throw new Error(`Sheets error: ${json.error}`);
    return json as T;
}

// Normaliza valores do Sheets (números vêm como string às vezes)
function normalizeProduct(raw: Record<string, unknown>): SheetProduct {
    return {
        id: String(raw.id ?? ""),
        name: String(raw.name ?? ""),
        description: String(raw.description ?? ""),
        price: typeof raw.price === "number" ? raw.price : parseFloat(String(raw.price ?? "0")),
        category: String(raw.category ?? ""),
        size: String(raw.size ?? ""),
        type: String(raw.type ?? ""),
        image: String(raw.image ?? ""),
        likes: typeof raw.likes === "number" ? raw.likes : parseInt(String(raw.likes ?? "0"), 10),
        isNew: raw.isNew === true || raw.isNew === "TRUE" || raw.isNew === "true",
        isBestSeller: raw.isBestSeller === true || raw.isBestSeller === "TRUE" || raw.isBestSeller === "true",
        createdAt: String(raw.createdAt ?? ""),
    };
}

function normalizeUser(raw: Record<string, unknown>): SheetUser {
    return {
        uid: String(raw.uid ?? ""),
        email: String(raw.email ?? ""),
        password: raw.password ? String(raw.password) : undefined,
        displayName: String(raw.displayName || ""),
        role: raw.role === "admin" ? "admin" : "customer",
        photoURL: raw.photoURL ? String(raw.photoURL) : undefined,
        whatsapp: raw.whatsapp ? String(raw.whatsapp) : undefined,
        cep: raw.cep ? String(raw.cep) : undefined,
        cidade: raw.cidade ? String(raw.cidade) : undefined,
        endereco: raw.endereco ? String(raw.endereco) : undefined,
        numero: raw.numero ? String(raw.numero) : undefined,
        complemento: raw.complemento ? String(raw.complemento) : undefined,
        estado: raw.estado ? String(raw.estado) : undefined,
        createdAt: String(raw.createdAt || new Date().toISOString()),
    };
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<SheetProduct[]> {
    const data = await sheetGet<{ products: Record<string, unknown>[] }>("getProducts");
    return (data.products || []).map(normalizeProduct);
}

export async function addProduct(
    product: Omit<SheetProduct, "id" | "createdAt">
): Promise<{ id: string }> {
    return sheetPost<{ id: string }>({ action: "addProduct", product });
}

export async function updateProduct(product: Partial<SheetProduct> & { id: string }): Promise<void> {
    await sheetPost<{ success: boolean }>({ action: "updateProduct", product });
}

export async function deleteProduct(id: string): Promise<void> {
    await sheetPost<{ success: boolean }>({ action: "deleteProduct", id });
}

// ─── USERS ────────────────────────────────────────────────────────────────────

export async function getUsers(): Promise<SheetUser[]> {
    const data = await sheetGet<{ users: Record<string, unknown>[] }>("getUsers");
    return (data.users || []).map(normalizeUser);
}

export async function getUserById(uid: string): Promise<SheetUser | null> {
    const data = await sheetPost<{ user: Record<string, unknown> | null }>({
        action: "getUser",
        uid,
    });
    return data.user ? normalizeUser(data.user) : null;
}

export async function upsertUser(user: SheetUser): Promise<void> {
    await sheetPost<{ success: boolean }>({ action: "upsertUser", user });
}

export async function updateUserRole(uid: string, role: "admin" | "customer"): Promise<void> {
    await sheetPost<{ success: boolean }>({ action: "updateUserRole", uid, role });
}

export async function sheetLogin(email: string, password: string): Promise<SheetUser | null> {
    const data = await sheetPost<{ success: boolean; user?: Record<string, unknown>; error?: string }>({
        action: "login",
        email,
        password,
    });
    if (data.success && data.user) {
        return normalizeUser(data.user);
    }
    if (data.error) throw new Error(data.error);
    return null;
}

export async function sheetRegister(user: Omit<SheetUser, "uid" | "createdAt">): Promise<SheetUser> {
    const data = await sheetPost<{ success: boolean; user?: Record<string, unknown>; error?: string }>({
        action: "register",
        user,
    });
    if (data.success && data.user) {
        return normalizeUser(data.user);
    }
    throw new Error(data.error || "Erro ao registrar usuário");
}

export async function sheetUpdateUser(uid: string, updates: Partial<SheetUser>): Promise<void> {
    const data = await sheetPost<{ success: boolean; error?: string }>({
        action: "updateUser",
        user: { uid, ...updates },
    });
    if (!data.success) {
        throw new Error(data.error || "Erro ao atualizar usuário");
    }
}

export async function uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            try {
                const base64 = reader.result as string;
                const data = await sheetPost<{ success: boolean; url?: string; error?: string }>({
                    action: "uploadFile",
                    file: base64,
                    fileName: file.name,
                    mimeType: file.type
                });
                
                if (data.success && data.url) {
                    resolve(data.url);
                } else {
                    reject(new Error(data.error || "Erro no upload para o Drive"));
                }
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
    });
}

// ─── FAVORITES ────────────────────────────────────────────────────────────────

export async function getFavorites(userId: string): Promise<string[]> {
    const data = await sheetGet<{ favorites: SheetFavorite[] }>("getFavorites", { userId });
    return (data.favorites || []).map((f) => f.productId);
}

export async function addFavorite(userId: string, productId: string): Promise<void> {
    await sheetPost<{ success: boolean }>({ action: "addFavorite", userId, productId });
}

export async function removeFavorite(userId: string, productId: string): Promise<void> {
    await sheetPost<{ success: boolean }>({ action: "removeFavorite", userId, productId });
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<Record<string, string>> {
    const data = await sheetGet<{ settings: Record<string, string> }>("getSettings");
    return data.settings || {};
}

export async function updateSetting(key: string, value: string): Promise<void> {
    await sheetPost<{ success: boolean }>({ action: "updateSetting", key, value });
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────

export async function getOrders(userId: string): Promise<SheetOrder[]> {
    const data = await sheetGet<{ orders: Record<string, unknown>[] }>("getOrders", { userId });
    return (data.orders || []).map((raw) => ({
        id: String(raw.id ?? ""),
        userId: String(raw.userId ?? ""),
        date: String(raw.date ?? ""),
        items: (() => {
            try {
                return typeof raw.items === "string"
                    ? JSON.parse(raw.items)
                    : (raw.items as SheetOrderItem[]) || [];
            } catch {
                return [];
            }
        })(),
        total: typeof raw.total === "number" ? raw.total : parseFloat(String(raw.total ?? "0")),
        status: String(raw.status ?? ""),
        paymentMethod: String(raw.paymentMethod ?? ""),
    }));
}

export async function addOrder(order: Omit<SheetOrder, "id">): Promise<{ id: string }> {
    return sheetPost<{ id: string }>({ action: "addOrder", order });
}
