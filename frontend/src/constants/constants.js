// export const GOOGLE_CLIENT_ID = "4254199252-b3d3bdno9lq3dgoq4ngb2e8td02nkbqj.apps.googleusercontent.com";
export const GOOGLE_CLIENT_ID = "4254199252-7gqui7sm0d2on5mrrnegnchjd5fh0ak8.apps.googleusercontent.com";
export const CLIENT_URL = process.env.NODE_ENV !== 'production'? "https://localhost:3000" : "https://copomodoro.com";
export const SERVER_URL = process.env.NODE_ENV !== 'production' ? "https://127.0.0.1:8000" : "https://api.copomodoro.com";
// export const ZOOM_LINK_URL = "https://zoom.us/oauth/authorize?client_id=gcmN37AQ2CFfbZbYZzmA&response_type=code&redirect_uri=https://localhost:3000/zoom";
// test with new link
export const ZOOM_LINK_URL = process.env.NODE_ENV !== 'production' ?
"https://zoom.us/oauth/authorize?client_id=6w4rRPpT9uoQgMR6H0pQ&response_type=code&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fzoom":
"https://zoom.us/oauth/authorize?response_type=code&client_id=51hEnCNfRhWz9FVfFU1ZYg&redirect_uri=https://copomodoro.com/zoom";