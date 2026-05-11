async function loadPeople() {
    try {
        const res = await fetch("/api");
        let data = await res.json();

        const sortBy = document.getElementById("sortSelect").value;

        // Zoradenie
        data.sort((a, b) => {
            if (sortBy === "name-asc") return a.name.localeCompare(b.name);
            if (sortBy === "name-desc") return b.name.localeCompare(a.name);
            if (sortBy === "age-asc") return Number(a.age) - Number(b.age);
            if (sortBy === "age-desc") return Number(b.age) - Number(a.age);
            return a.id - b.id;
        });

        const div = document.getElementById("mojDivVJs");
        div.innerHTML = "";

        data.forEach(person => {
            div.innerHTML += `
                <div class="card">
                    <img src="${person.image}" alt="${person.name}">
                    <p><b>${person.name}</b></p>
                    <p>Vek: ${person.age}</p>
                    <button onclick="deletePerson(${person.id})">Odstrániť</button>
                </div>
            `;
        });
    } catch (err) {
        console.error("Chyba:", err);
    }
}

// Pridanie osoby
document.getElementById("addForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPerson = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        image: document.getElementById("image").value
    };

    await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPerson)
    });

    e.target.reset();
    loadPeople();
});

// Vymazanie osoby
async function deletePerson(id) {
    if (!confirm("Odstrániť?")) return;
    await fetch(`/api/${id}`, { method: "DELETE" });
    loadPeople();
}

// Spustenie pri načítaní
loadPeople();
