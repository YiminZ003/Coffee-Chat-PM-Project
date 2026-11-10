export function isUofTEmail(value:string){const email=value.trim().toLowerCase();return /^[^\s@]+@(?:[a-z0-9-]+\.)*(?:utoronto\.ca)$/.test(email);}
