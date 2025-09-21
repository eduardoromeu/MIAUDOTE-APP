
export default function LogOut() {
  if (typeof window !== "undefined" && window.localStorage) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      user.logado = false;
      localStorage.setItem("user", JSON.stringify(user));
    }
    window.location.href = "/";
  }
  return (<div></div>);
}