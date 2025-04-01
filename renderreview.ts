import { Review } from "./main";


/***** Reviews *****/
async function onFetchReviewsClick(): Promise<void> {
    try {
        const response = await fetch("http://localhost:3000/reviews");
        const reviewsList: Review[] = await response.json();

        if (reviewsContainer) {
            reviewsContainer.innerHTML = reviewsList
                .map(
                    (review) => `
                        <div class="card p-3 shadow-sm mt-3">
                            <h4>⭐ ${review.stars}/5</h4>
                            <p><strong>${review.author} says:</strong> ${review.text}</p>
                            <p><small>Book ID: ${review.bookId}</small></p>
                        </div>
                    `
                )
                .join("");
        }
    } catch (error) {
        console.error("Error fetching reviews:", error);
    }
}