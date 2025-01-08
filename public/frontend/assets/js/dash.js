let gettoken=localStorage.getItem("auth-token")
if(!gettoken){
    alert("Session Expired")
    window.location="../../Login.html"
}
document.getElementById("logout").addEventListener("click",function(){
    localStorage.removeItem("auth-token")
    window.location="../../Login.html"
})
