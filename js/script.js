// ========================================
// FraizaDollar - Main JavaScript
// ========================================

const CONTACT_EMAIL = "hello@fraizadollar.com";

// Single source of truth for every product on the site.
const products = [{
        id: 1,
        title: "Map Graphic Tee",
        description: "Soft cotton t-shirt with detailed back print",
        price: "From R350",
        image: "_images/map-tee.jpg",
        category: "tees",
        badge: "Popular"
    },
    {
        id: 2,
        title: "Skeleton Oversized Tee",
        description: "Oversized fit with bold front graphic",
        price: "From R350",
        image: "_images/skeleton-tee.jpg",
        category: "tees",
        badge: null
    },
    {
        id: 3,
        title: "Money Maker Graphic Tee",
        description: "Streetwear statement tee with large front print",
        price: "From R330",
        image: "_images/money-maker-tee.jpg",
        category: "tees",
        badge: null
    },
    {
        id: 4,
        title: "Colourblock Hoodies",
        description: "Premium fleece hoodies in blue & pink",
        price: "From R580",
        image: "_images/hoodies.jpg",
        category: "hoodies",
        badge: "New"
    },
    {
        id: 5,
        title: "Technical Windbreaker",
        description: "Lightweight water-resistant jacket with zip pockets",
        price: "From R650",
        image: "_images/windbreaker.jpg",
        category: "jackets",
        badge: null
    },
    {
        id: 6,
        title: "R1 Logo Tee",
        description: "Classic black tee with large circular logo print",
        price: "From R300",
        image: "_images/r1-tee-black.jpg",
        category: "tees",
        badge: null
    },
    {
        id: 7,
        title: "Tracksuit Jacket",
        description: "Lightweight windbreaker with reflective details",
        price: "From R400",
        image: "_images/tracksuit-jacket.jpg",
        category: "jackets",
        badge: null,
        featured: true
    },
    {
        id: 8,
        title: "Heavyweight Joggers",
        description: "Soft-fleece joggers with zip pockets",
        price: "From R480",
        image: "_images/joggers.jpg",
        category: "bottoms",
        badge: null,
        featured: true
    },
    {
        id: 9,
        title: "Fleece Quarter-Zip",
        description: "Warm fleece pullover with zip collar",
        price: "From R350",
        image: "_images/quarter-zip.jpg",
        category: "hoodies",
        badge: null,
        featured: true
    },
    {
        id: 10,
        title: "Red R1 Coin Tee",
        description: "Bold statement t-shirt with a large R1 coin print",
        price: "From R320",
        image: "_images/r1-tee-red.jpg",
        category: "tees",
        badge: null,
        featured: true
    }
];

const categoryNames = {
    tees: "T-Shirts",
    hoodies: "Hoodies",
    jackets: "Jackets",
    bottoms: "Bottoms"
};

function productCardHTML(p) {
    const badge = p.badge ? `<div class="product-badge">${p.badge}</div>` : "";
    return `
        <div class="product-card" data-category="${p.category}">
            <div class="product-image">
                <img src="${p.image}" alt="${p.title}" loading="lazy">
                ${badge}
            </div>
            <div class="product-info">
                <h3>${p.title}</h3>
                <p>${p.description}</p>
                <div class="product-bottom">
                    <span class="price">${p.price}</span>
                    <a href="product.html?id=${p.id}" class="btn-view" aria-label="View ${p.title}">View</a>
                </div>
            </div>
        </div>`;
}

document.addEventListener("DOMContentLoaded", function() {

            // 1. Mobile hamburger menu
            const headerContainer = document.querySelector(".header-container");
            const nav = document.querySelector("nav");

            if (headerContainer && nav) {
                const hamburger = document.createElement("button");
                hamburger.className = "hamburger";
                hamburger.setAttribute("aria-label", "Toggle navigation");
                hamburger.setAttribute("aria-expanded", "false");
                hamburger.innerHTML = "<span></span><span></span><span></span>";
                headerContainer.appendChild(hamburger);

                const closeMenu = () => {
                    nav.classList.remove("active");
                    hamburger.classList.remove("active");
                    hamburger.setAttribute("aria-expanded", "false");
                };

                hamburger.addEventListener("click", function() {
                    const open = nav.classList.toggle("active");
                    hamburger.classList.toggle("active", open);
                    hamburger.setAttribute("aria-expanded", String(open));
                });

                nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
                window.addEventListener("resize", () => {
                    if (window.innerWidth > 768) closeMenu();
                });
            }

            // 2. Smooth scrolling (only for real in-page anchors, never a bare "#")
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener("click", function(e) {
                    const href = this.getAttribute("href");
                    if (!href || href.length < 2) return;
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                });
            });

            // 3. Header shadow on scroll
            const header = document.querySelector("header");
            if (header) {
                const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 15);
                window.addEventListener("scroll", onScroll, { passive: true });
                onScroll();
            }

            // 4. Contact form (opens the visitor's email app with the message filled in)
            const contactForm = document.querySelector(".contact-form form");
            if (contactForm) {
                const subjectField = contactForm.querySelector("#subject");
                const wanted = new URLSearchParams(window.location.search).get("product");
                if (subjectField && wanted) subjectField.value = "Quote request: " + wanted;

                contactForm.addEventListener("submit", function(e) {
                    e.preventDefault();

                    const name = fieldValue(this, "#name");
                    const email = fieldValue(this, "#email");
                    const subject = fieldValue(this, "#subject") || "Website enquiry";
                    const message = fieldValue(this, "#message");

                    const oldMsg = this.querySelector(".form-message");
                    if (oldMsg) oldMsg.remove();

                    if (!name || !email || !message) {
                        showFormMessage(this, "Please fill in all required fields.", "error");
                        return;
                    }

                    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
                    window.location.href =
                        `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                    showFormMessage(this, "Opening your email app so you can send your message.", "success");
                    this.reset();
                });
            }

            // Reads a form field safely (plain JS, no "?." so older editors/formatters can't break it)
            function fieldValue(form, selector) {
                const el = form.querySelector(selector);
                return el ? el.value.trim() : "";
            }

            function showFormMessage(form, text, type) {
                const msg = document.createElement("div");
                msg.className = `form-message ${type}`;
                msg.setAttribute("role", "status");
                msg.textContent = text;
                form.prepend(msg);
                setTimeout(() => msg.remove(), 5000);
            }

            // 5. Homepage featured products
            const featuredGrid = document.getElementById("featuredGrid");
            if (featuredGrid) {
                featuredGrid.innerHTML = products.filter(p => p.featured).map(productCardHTML).join("");
            }

            // 6. Shop page: render + filters
            const shopGrid = document.getElementById("shopGrid");
            if (shopGrid) {
                const filterButtons = document.querySelectorAll(".filter-btn");

                const renderShop = filter => {
                    const list = filter === "all" ? products : products.filter(p => p.category === filter);
                    shopGrid.innerHTML = list.length ?
                        list.map(productCardHTML).join("") :
                        `<div class="empty-state"><h2>Nothing here yet</h2><p>No products in this category right now.</p></div>`;
                };

                renderShop("all");

                filterButtons.forEach(btn => {
                    btn.addEventListener("click", function() {
                        filterButtons.forEach(b => b.classList.remove("active"));
                        this.classList.add("active");
                        renderShop(this.getAttribute("data-filter"));
                    });
                });
            }

            // 7. Product detail page
            const detail = document.getElementById("productDetail");
            if (detail) {
                const id = parseInt(new URLSearchParams(window.location.search).get("id"), 10);
                const product = products.find(p => p.id === id);

                if (!product) {
                    document.title = "Product not found | FraizaDollar";
                    detail.innerHTML = `
                <div class="empty-state">
                    <h2>We couldn't find that product</h2>
                    <p>It may have been removed, or the link is incorrect.</p>
                    <a href="shop.html" class="btn-primary">Back to shop</a>
                </div>`;
                } else {
                    document.title = `${product.title} | FraizaDollar`;
                    const badge = product.badge ? `<div class="product-badge">${product.badge}</div>` : "";
                    const related = products
                        .filter(p => p.category === product.category && p.id !== product.id)
                        .slice(0, 4);

                    detail.innerHTML = `
                <div class="breadcrumb">
                    <a href="shop.html">Shop</a> / ${categoryNames[product.category]} / ${product.title}
                </div>
                <div class="detail-grid">
                    <div class="detail-image">
                        <img src="${product.image}" alt="${product.title}">
                        ${badge}
                    </div>
                    <div class="detail-info">
                        <p class="detail-category">${categoryNames[product.category]}</p>
                        <h1>${product.title}</h1>
                        <p class="detail-price">${product.price}</p>
                        <p class="detail-desc">${product.description}.</p>
                        <p class="detail-note">Every piece can be branded with your logo or artwork. Final pricing depends on quantity and print method.</p>
                        <a href="contact.html?product=${encodeURIComponent(product.title)}" class="btn-primary">Request a quote</a>
                    </div>
                </div>
                ${related.length ? `
                <div class="related">
                    <h2>More ${categoryNames[product.category]}</h2>
                    <div class="products-grid">${related.map(productCardHTML).join("")}</div>
                </div>` : ""}`;
        }
    }
});