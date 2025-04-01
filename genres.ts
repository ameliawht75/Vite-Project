import { Genre } from "./main";

const genresContainer = document.getElementById("genres-container");
const genreIdTextbox = document.getElementById("genre-id-textbox"); //Was able to get textbox to work in this area and in reviews.

async function onFetchGenresClick() {
  const response = await fetch("http://localhost:3000/genres");
  const genreList = await response.json();

  genresContainer.innerHTML = genreList
      .map(
          (genre) => `<div class="bg-light rounded mt-5">
              <h3>${genre.title}</h3>
              <p>id: ${genre.id}</p>
          </div>`
      )
      .join("");
}

async function onCreateGenreClick() {
  const newGenre = { title: "New Genre" };
  const response = await fetch("http://localhost:3000/genres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGenre),
  });

  const createdGenre = await response.json();
  console.log("Created Genre:", createdGenre);
}

async function onDeleteGenreClick() {
  const idToDelete = genreIdTextbox.value;
  if (!idToDelete) {
      console.log("Enter a genre ID to delete");
      return;
  }

  await fetch(`http://localhost:3000/genres/${idToDelete}`, {
      method: "DELETE",
  });

  genreIdTextbox.value = "";
}