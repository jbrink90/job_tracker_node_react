export default function isDev(): boolean
{
    return !import.meta.env.MODE || import.meta.env.MODE === 'development';
}
