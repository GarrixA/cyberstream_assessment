export const root_home_page = `
<div style="
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
">
  <h1>Welcome to CyberStream</h1>
  <p>Want to test APIs? <span style="color: MediumSeaGreen;">Click on View swagger docs.</span></p>
  <br/>
  <a
    href="/api/v1/docs"
    style="
      background-color: MediumSeaGreen;
      color: white;
      padding: 6px 20px;
      border: none;
      border-radius: 5px;
      text-decoration: none;
    "
  >
    View swagger docs
  </a>
</div>
`;
