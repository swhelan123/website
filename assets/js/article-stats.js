// Import Firebase functions
import { doc, updateDoc, increment, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

class ArticleStats {
  constructor(articleId) {
    this.articleId = articleId;
    this.userKey = this.getUserKey();
    this.db = window.firebaseDb;
    this.init();
  }

  getUserKey() {
    let key = localStorage.getItem("user_key");
    if (!key) {
      key = "user_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
      localStorage.setItem("user_key", key);
    }
    return key;
  }

  async init() {
    console.log("Initializing article stats for:", this.articleId);

    try {
      // Only count view once per session
      if (!sessionStorage.getItem(`viewed_${this.articleId}`)) {
        await this.incrementViews();
        sessionStorage.setItem(`viewed_${this.articleId}`, "true");
        console.log("View counted for article:", this.articleId);
      }

      // Load and display current stats
      await this.loadStats();

      // Make like button clickable
      this.setupLikeButton();

      console.log("Article stats initialized successfully");
    } catch (error) {
      console.error("Error initializing stats:", error);
      this.showDefaultStats();
    }
  }

  async incrementViews() {
    const articleRef = doc(this.db, "articles", this.articleId);
    try {
      await updateDoc(articleRef, {
        views: increment(1),
        lastViewed: new Date(),
      });
    } catch (error) {
      // Document doesn't exist, create it
      await setDoc(articleRef, {
        views: 1,
        likes: 0,
        createdAt: new Date(),
        lastViewed: new Date(),
      });
      console.log("Created new article document:", this.articleId);
    }
  }

  async loadStats() {
    const articleRef = doc(this.db, "articles", this.articleId);
    const userLikeRef = doc(this.db, "user_likes", `${this.userKey}_${this.articleId}`);

    try {
      const [articleDoc, userLikeDoc] = await Promise.all([getDoc(articleRef), getDoc(userLikeRef)]);

      const stats = articleDoc.exists() ? articleDoc.data() : { views: 0, likes: 0 };
      const hasLiked = userLikeDoc.exists() && userLikeDoc.data().liked;

      console.log("Loaded stats:", stats, "User liked:", hasLiked);

      this.updateDisplay(stats.views || 0, stats.likes || 0, hasLiked);
    } catch (error) {
      console.error("Error loading stats:", error);
      this.showDefaultStats();
    }
  }

  async toggleLike() {
    console.log("Toggling like for article:", this.articleId);

    const userLikeRef = doc(this.db, "user_likes", `${this.userKey}_${this.articleId}`);
    const articleRef = doc(this.db, "articles", this.articleId);

    try {
      const userLikeDoc = await getDoc(userLikeRef);
      const hasLiked = userLikeDoc.exists() && userLikeDoc.data().liked;

      if (hasLiked) {
        // Unlike
        await setDoc(userLikeRef, { liked: false, updatedAt: new Date() });
        await updateDoc(articleRef, { likes: increment(-1) });
        console.log("Article unliked");
      } else {
        // Like
        await setDoc(userLikeRef, { liked: true, likedAt: new Date() });
        await updateDoc(articleRef, { likes: increment(1) });
        console.log("Article liked");
      }

      // Reload stats to update display
      await this.loadStats();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  }

  updateDisplay(views, likes, hasLiked) {
    // Find elements using multiple selectors to ensure we get them
    const viewsElement =
      document.querySelector(".article-stats .stat .fa-eye")?.parentElement || document.querySelector(".stat:has(.fa-eye)") || document.querySelector('[class*="fa-eye"]')?.parentElement;

    const likesElement =
      document.querySelector(".article-stats .stat .fa-heart")?.parentElement || document.querySelector(".stat:has(.fa-heart)") || document.querySelector('[class*="fa-heart"]')?.parentElement;

    console.log("Found elements:", { viewsElement, likesElement });

    if (viewsElement) {
      viewsElement.innerHTML = `<i class="fas fa-eye"></i> ${this.formatNumber(views)} views`;
      console.log("Updated views display:", views);
    }

    if (likesElement) {
      const heartClass = hasLiked ? "fas fa-heart" : "far fa-heart";
      likesElement.innerHTML = `<i class="${heartClass}"></i> ${this.formatNumber(likes)} likes`;
      likesElement.style.color = hasLiked ? "#e74c3c" : "";
      console.log("Updated likes display:", likes, "liked:", hasLiked);
    }
  }

  setupLikeButton() {
    const likesElement =
      document.querySelector(".article-stats .stat .fa-heart")?.parentElement || document.querySelector(".stat:has(.fa-heart)") || document.querySelector('[class*="fa-heart"]')?.parentElement;

    if (likesElement) {
      likesElement.style.cursor = "pointer";
      likesElement.style.transition = "transform 0.2s ease";
      likesElement.title = "Click to like this article";

      // Remove any existing listeners
      likesElement.replaceWith(likesElement.cloneNode(true));
      const newLikesElement =
        document.querySelector(".article-stats .stat .fa-heart")?.parentElement || document.querySelector(".stat:has(.fa-heart)") || document.querySelector('[class*="fa-heart"]')?.parentElement;

      newLikesElement.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleLike();
        // Add click animation
        newLikesElement.style.transform = "scale(1.1)";
        setTimeout(() => {
          newLikesElement.style.transform = "scale(1)";
        }, 150);
      });

      console.log("Like button setup complete");
    } else {
      console.warn("Could not find like button element");
    }
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  }

  showDefaultStats() {
    console.log("Showing default stats due to error");
    const viewsElement = document.querySelector(".article-stats .stat .fa-eye")?.parentElement;
    const likesElement = document.querySelector(".article-stats .stat .fa-heart")?.parentElement;

    if (viewsElement) viewsElement.innerHTML = `<i class="fas fa-eye"></i> -- views`;
    if (likesElement) likesElement.innerHTML = `<i class="far fa-heart"></i> -- likes`;
  }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, waiting for Firebase...");

  // Wait a bit for Firebase to initialize
  setTimeout(() => {
    if (window.firebaseDb) {
      console.log("Firebase DB found, initializing stats...");

      // Determine article ID based on current page
      let articleId = "homepage-featured";

      if (window.location.pathname.includes("linux-mint")) {
        articleId = "linux-mint-journey";
      }

      console.log("Using article ID:", articleId);
      window.articleStats = new ArticleStats(articleId);
    } else {
      console.error("Firebase DB not found - check initialization");
    }
  }, 2000);
});
