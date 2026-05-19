<template>
  <div class="home-page">
    <div class="hero-image-container position-relative overflow-hidden">
      <img 
        src="https://mdbootstrap.com/img/new/fluid/city/055.webp" 
        class="hero-img" 
        alt="City View Banner"
      />
      
      <a href="#!" class="mask-link">
        <div class="mask-overlay"></div>
      </a>
      
      <div class="hero-text text-center text-white">
        <h1 class="display-3 fw-bold">Explore the City</h1>
        <p class="lead">Discover amazing places and experiences.</p>
      </div>
    </div>

    <div class="container mt-5 mb-5">
      <div class="card shadow-sm border-0 p-4">
        <h2 class="text-secondary mb-4">Content Area</h2>
        <p>This is where your table or other information goes, inside a standard container for readability.</p>
        </div>
    </div>
  </div>
</template>

<script setup>
// មិនមាន Logic ទេ
</script>

<style scoped>
/* --- Style សម្រាប់រូបភាពធំពេញទទឹង --- */
.hero-image-container {
  width: 100%;
  height: 80vh; /* កំណត់កម្ពស់ឱ្យធំ (៨០% នៃកម្ពស់អេក្រង់) */
  background-color: #333; /* ពណ៌ផ្ទៃក្រោយសម្រាប់ការពារ */
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* ធ្វើឱ្យរូបភាពលាតពេញដោយមិនបែករាង */
  object-position: center; /* ដាក់រូបភាពចំកណ្ដាល */
  transition: transform 0.5s ease; /* transition សម្រាប់ effect */
}

/* --- Style សម្រាប់ Overlay/Mask --- */
.mask-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(57, 192, 237, 0.3); /* ពណ៌ខៀវស្រទន់ overlay */
  opacity: 0; /* លាក់ overlay ពេលធម្មតា */
  transition: opacity 0.4s ease;
  z-index: 1; /* ដាក់ឱ្យនៅពីលើរូបភាព */
}

/* --- Hover Effect --- */
.hero-image-container:hover .hero-img {
  transform: scale(1.05); /* រូបភាពរីកធំបន្តិចពេល hover */
}

.hero-image-container:hover .mask-overlay {
  opacity: 1; /* បង្ហាញ overlay ពេល hover */
}

/* --- Style សម្រាប់អក្សរលើរូបភាព (Optional) --- */
.hero-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2; /* ដាក់ឱ្យនៅពីលើគេបង្អស់ */
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5); /* បន្ថែមស្រមោលឱ្យអក្សរច្បាស់ */
}
</style>