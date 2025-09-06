<template>
  <footer class="bgColorWhite py-16 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div class="brand">
          <h2 class="textColorPrimary megaFont font-bold mb-4">SyncSpace</h2>
          <p class="textColorBlack normalFont">
            SyncSpace design by 
            <NuxtLink to="#" class="textColorBlack underline hover:textColorPrimary transition-colors">
              Thibaut St
            </NuxtLink>
          </p>
        </div>

        <div class="nav-section">
          <h3 class="textColorBlack largeFont font-semibold mb-6">Pages</h3>
          <nav class="space-y-3">
            <NuxtLink 
              to="/" 
              class="block textColorBlack normalFont hover:textColorPrimary transition-colors"
            >
              Accueil
            </NuxtLink>
            <NuxtLink 
              to="/login" 
              class="block textColorBlack normalFont hover:textColorPrimary transition-colors"
            >
              Login
            </NuxtLink>
            <NuxtLink 
              to="/about" 
              class="block textColorBlack normalFont hover:textColorPrimary transition-colors"
            >
                À propos
            </NuxtLink>
            <NuxtLink 
              to="/contact" 
              class="block textColorBlack normalFont hover:textColorPrimary transition-colors"
            >
              Contact
            </NuxtLink>
            <NuxtLink 
              to="#" 
              class="block textColorBlack normalFont hover:textColorPrimary transition-colors opacity-50 cursor-not-allowed"
              disabled
            >
              Mentions légales
            </NuxtLink>
            <NuxtLink 
              to="#" 
              class="block textColorBlack normalFont hover:textColorPrimary transition-colors opacity-50 cursor-not-allowed"
              disabled
            >
              Politique de confidentialité
            </NuxtLink>
          </nav>
        </div>

        <div class="nav-section">
          <h3 class="textColorBlack largeFont font-semibold mb-6">Développer</h3>
          <nav class="space-y-3">
            <NuxtLink 
              to="https://github.com/twde49/SyncSpace-Web" 
              class="block textColorBlack normalFont hover:textColorPrimary transition-colors"
            >
              Github
            </NuxtLink>
            <NuxtLink 
              to="#" 
              class="block textColorBlack normalFont hover:textColorPrimary transition-colors opacity-50 cursor-not-allowed"
              disabled
            >
              Documentation Interface
            </NuxtLink>
            <NuxtLink 
              to="https://apisyncspace.thibautstachnick.com" 
              class="block textColorBlack normalFont hover:textColorPrimary transition-colors"
            >
              Documentation API
            </NuxtLink>
            <NuxtLink 
              to="#" 
              class="block textColorBlack normalFont hover:textColorPrimary transition-colors opacity-50 cursor-not-allowed"
              disabled
            >
              Collaboration
            </NuxtLink>
          </nav>
        </div>
      </div>

      <div class="border-t border-gray-300 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="copyright">
          <p class="textColorBlack normalFont">© SyncSpace - 2025. All rights reserved.</p>
        </div>

        <div class="flex flex-col justify-center items-center">
            <div class="flex items-center gap-4">
              <a 
                href="https://github.com/twde49/SyncSpace-Web" 
                class="textColorBlack hover:textColorPrimary transition-colors p-2"
                aria-label="GitHub"
              >
                <Icon name="ph:github-logo" class="w-6 h-6" />
              </a>
              <span 
                class="textColorBlack opacity-50 cursor-not-allowed p-2"
                aria-label="Instagram disabled"
              >
                <Icon name="ph:instagram-logo" class="w-6 h-6" />
              </span>
              <span 
                class="textColorBlack opacity-50 cursor-not-allowed p-2"
                aria-label="LinkedIn disabled"
              >
                <Icon name="ph:linkedin-logo" class="w-6 h-6" />
              </span>
              <span 
                class="textColorBlack opacity-50 cursor-not-allowed p-2"
                aria-label="Twitter disabled"
              >
                <Icon name="ph:twitter-logo" class="w-6 h-6" />
              </span>
            </div>

            <p class="textColorBlack normalFont text-center md:text-right">
              Vos données sont protégées conformément au RGPD.
            </p>
        </div>
      </div>
    </div>
  </footer>
</template>
