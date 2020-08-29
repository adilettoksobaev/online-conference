export const baseUrl = () => {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return 'https://biz.vicon.kz/';
    } else {
        return `https://${window.location.hostname}/`
    }
}