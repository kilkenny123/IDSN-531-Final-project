const footerTemplate = document.createElement("template");

footerTemplate.innerHTML = `
    <div class="footer">
        <div class="footer-content">
          <img src="logo-white.png" alt="Logo" id="logo"></img>
          <div class="footer-social">
            <span>Follow Us:</span>
            <a href="#" aria-label="Instagram"
              ><img
                width="24"
                height="24"
                src="https://img.icons8.com/ios/24/instagram-new--v1.png"
                alt="instagram-new--v1"
            /></a>
            <a href="#" aria-label="TikTok"
              ><img
                width="24"
                height="24"
                src="https://img.icons8.com/material-outlined/24/tiktok.png"
                alt="tiktok"
            /></a>
            <a href="#" aria-label="Pinterest"
              ><img
                width="24"
                height="24"
                src="https://img.icons8.com/ios/24/pinterest--v1.png"
                alt="pinterest--v1"
            /></a>
            <a href="#" aria-label="Tumblr"
              ><img
                width="24"
                height="24"
                src="https://img.icons8.com/ios/24/tumblr--v1.png"
                alt="tumblr--v1"
            /></a>
          </div>
        </div>
    </div>
`;

function addFooter() {
  const footerDiv = document.getElementById("footer");
  if (footerDiv) {
    footerDiv.appendChild(footerTemplate.content);
  } else {
    console.error("Footer div not found");
  }
}
