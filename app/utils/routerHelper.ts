export const getRootUrl = () => {
    let url: string
    url = location.origin
    if (location.hash !== '') {
        url += '/#'
    }
    return url
}