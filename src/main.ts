import config from './config/config';
import './style/style.css';

const API_BASE = `http://localhost:${config.port}${config.apiUrl}`;
type Item = { id: number; name: string };

const app = document.querySelector<HTMLDivElement>("#app")!;
app.innerHTML = `
  <h2>Items Client</h2>

  <nav style="margin-bottom:12px;">
    <button id="nav-home">Home</button>
    <button id="nav-items">Items</button>
    <button id="nav-create">Create</button>
  </nav>

  <div id="page"></div>
`;

const page = document.querySelector<HTMLDivElement>("#page")!;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) throw new Error(typeof data === "string" ? data : JSON.stringify(data));
  return data as T;
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]!));
}

function setRoute(route: "home" | "items" | "create") {
  if (route === "home") {
    page.innerHTML = `<p>Use the tabs to call your Express API.</p>`;
    return;
  }

  if (route === "items") {
    page.innerHTML = `<p>Loading…</p>`;
    request<Item[]>("", { method: "GET" })
      .then(items => {
        page.innerHTML = `
          <h3>All items</h3>
          <button id="refresh">Refresh</button>
          <pre>${esc(JSON.stringify(items, null, 2))}</pre>
        `;
        document.querySelector("#refresh")!.addEventListener("click", () => setRoute("items"));
      })
      .catch(err => {
        page.innerHTML = `<p style="color:red;">${esc(String(err))}</p>`;
      });
    return;
  }

  // create page
  page.innerHTML = `
    <h3>Create item</h3>
    <input id="name" placeholder="name" value="Sample Item" />
    <button id="create">Create</button>
    <h4>Response</h4>
    <pre id="out">—</pre>
  `;

  const nameEl = document.querySelector<HTMLInputElement>("#name")!;
  const out = document.querySelector<HTMLPreElement>("#out")!;

  document.querySelector("#create")!.addEventListener("click", async () => {
    out.textContent = "Creating…";
    try {
      const created = await request<Item>("", {
        method: "POST",
        body: JSON.stringify({ name: nameEl.value }),
      });
      out.textContent = JSON.stringify(created, null, 2);
    } catch (e) {
      out.textContent = String(e);
    }
  });
}

document.querySelector("#nav-home")!.addEventListener("click", () => setRoute("home"));
document.querySelector("#nav-items")!.addEventListener("click", () => setRoute("items"));
document.querySelector("#nav-create")!.addEventListener("click", () => setRoute("create"));

setRoute("home");