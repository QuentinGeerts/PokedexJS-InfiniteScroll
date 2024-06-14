export async function getDataFromURL (url) {
    return (await fetch(url)).json();
}