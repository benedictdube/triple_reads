function loadPage() {
    loadHeader();
    loadFooter();
}

function loadHeader() {
    const header = document.getElementById("header") as HTMLElement;
    header.classList.add("header");

    // add logo section 
    const logo_section = document.createElement("section") as HTMLElement;
    logo_section.classList.add("logo");
    
    // logo hyperlink
    const logo_a = document.createElement("a") as HTMLAnchorElement;
    logo_a.href = "index.html";
    
    // adding the logo 
    const img = document.createElement("img") as HTMLImageElement;
    img.src = "images/logo.png";
    logo_a.appendChild(img);

    img.addEventListener("click", function () {
        // Redirect to index.html
        window.location.href = "index.html";
    });

    // adding the name 
    const h1 = document.createElement("h1") as HTMLHeadingElement;
    h1.textContent = "TripleBooks";
    logo_a.appendChild(h1);
    logo_section.appendChild(logo_a);

    header.appendChild(logo_section);

    // add menu section 
    const menu_section = document.createElement("section") as HTMLElement;
    menu_section.classList.add("menu");

    if (localStorage.getItem("email")) {
        // button 
        const button_logged_in = document.createElement("button") as HTMLButtonElement;
        button_logged_in.classList.add("logged-btn");
        button_logged_in.setAttribute("type", "button");
        button_logged_in.textContent = "xyz@bbd.co.za";
        menu_section.appendChild(button_logged_in);

        // dropdown 
        const dropdown_btn = document.createElement("button") as HTMLButtonElement;
        dropdown_btn.setAttribute("id", "dropdownButton");
        dropdown_btn.textContent = '\u25BC';
        menu_section.appendChild(dropdown_btn);

        // dropdown list 
        const dropdown_list : string[] = ["Add Books", "Manage Books", "Log Out"];
        const dropdown_list_href : string[] = ["addBook.html", "manageBooks.html", "#"];
        const ul = document.createElement("ul") as HTMLUListElement;
        ul.classList.add("dropdown-content");
        ul.setAttribute("id", "dropdownContent");
        dropdown_list.forEach((li_name, index) => {
            const href = dropdown_list_href[index];
            const li = document.createElement("li") as HTMLLIElement;
            const li_hyperlink = document.createElement("a") as HTMLAnchorElement;
            li_hyperlink.href = href;
            li_hyperlink.textContent = li_name;
            li.appendChild(li_hyperlink);
            ul.appendChild(li);
        });
        menu_section.appendChild(ul);
        
        dropdown_btn.addEventListener("click", function () {
            ul.classList.toggle("show");
        });

        // Close the dropdown if the user clicks outside of it
        window.addEventListener("click", function (event) {
            const targetElement = event.target as Element;

            if (!targetElement.matches("#dropdownButton")) {
                if (ul.classList.contains("show")) {
                    ul.classList.remove("show");
                }
            }
        });
    }
    else {
        // button 
        const button_logged_in = document.createElement("button") as HTMLButtonElement;
        button_logged_in.classList.add("login-btn");
        button_logged_in.setAttribute("type", "button");
        button_logged_in.textContent = "Sign Up";
		button_logged_in.onclick = function () {
        location.href = "login.html";
		};
        menu_section.appendChild(button_logged_in);
    }

    header.appendChild(menu_section);
}
