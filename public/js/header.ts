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


    // adding the logo 
    const img = document.createElement("img") as HTMLImageElement;
    img.src = "images/logo.png";
    logo_section.appendChild(img);

    img.addEventListener("click", function () {
        // Redirect to index.html
        window.location.href = "index.html";
    });

    // adding the name 
    const h1 = document.createElement("h1") as HTMLHeadingElement;
    h1.textContent = "TripleBooks";
    logo_section.appendChild(h1);

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
        const dropdown_list: string[] = ["Manage Books", "Log Out"];
        const dropdown_list_href: string[] = ["#", "#"];
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


        const dropdownButton = document.getElementById("dropdownButton") as HTMLButtonElement;
        const dropdownContent = document.getElementById("dropdownContent") as HTMLElement;

        dropdownButton.addEventListener("click", function () {
            dropdownContent.classList.toggle("show");
        });

        // Close the dropdown if the user clicks outside of it
        window.addEventListener("click", function (event) {
            const targetElement = event.target as Element;

            if (!targetElement.matches("#dropdownButton")) {
                if (dropdownContent.classList.contains("show")) {
                    dropdownContent.classList.remove("show");
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
        menu_section.appendChild(button_logged_in);
    }

    header.appendChild(menu_section);
}
