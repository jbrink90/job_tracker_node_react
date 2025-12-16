export default function isDev() {
    return !import.meta.env.MODE || import.meta.env.MODE === 'development';
}
