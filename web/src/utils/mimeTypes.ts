const mimeTypes: { [key: string]: string } = {
    'folder': 'folder',
    // Audio
    'audio/aac': 'aac',
    'audio/midi': 'midi',
    'audio/x-midi': 'midi',
    'audio/mpeg': 'mp3',
    'audio/ogg': 'oga',
    'audio/wav': 'wav',
    'audio/webm': 'weba',
    'audio/3gpp': '3gp',
    'audio/3gpp2': '3g2',

    // Video
    'video/x-msvideo': 'avi',
    'video/mpeg': 'mpeg',
    'video/ogg': 'ogv',
    'video/webm': 'webm',
    'video/3gpp': '3gp',
    'video/3gpp2': '3g2',

    // Image
    'image/bmp': 'bmp',
    'image/gif': 'gif',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/svg+xml': 'svg',
    'image/tiff': 'tiff',
    'image/webp': 'webp',
    'image/x-icon': 'ico',

    // Text
    'text/css': 'css',
    'text/csv': 'csv',
    'text/html': 'html',
    'text/calendar': 'ics',
    'text/javascript': 'js',
    'text/plain': 'txt',
    'text/xml': 'xml',

    // Application
    'application/java-archive': 'jar',
    'application/json': 'json',
    'application/ld+json': 'jsonld',
    'application/msword': 'doc',
    'application/octet-stream': 'bin',
    'application/ogg': 'ogx',
    'application/pdf': 'pdf',
    'application/rtf': 'rtf',
    'application/vnd.amazon.ebook': 'azw',
    'application/vnd.apple.installer+xml': 'mpkg',
    'application/vnd.mozilla.xul+xml': 'xul',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.ms-fontobject': 'eot',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.oasis.opendocument.presentation': 'odp',
    'application/vnd.oasis.opendocument.spreadsheet': 'ods',
    'application/vnd.oasis.opendocument.text': 'odt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.rar': 'rar',
    'application/vnd.visio': 'vsd',
    'application/x-7z-compressed': '7z',
    'application/x-abiword': 'abw',
    'application/x-bzip': 'bz',
    'application/x-bzip2': 'bz2',
    'application/x-csh': 'csh',
    'application/x-freearc': 'arc',
    'application/x-sh': 'sh',
    'application/x-shockwave-flash': 'swf',
    'application/x-tar': 'tar',
    'application/xhtml+xml': 'xhtml',
    'application/xml': 'xml',
    'application/zip': 'zip',
    'application/x-www-form-urlencoded': 'urlencoded',

    // Fonts
    'font/otf': 'otf',
    'font/ttf': 'ttf',
    'font/woff': 'woff',
    'font/woff2': 'woff2',

    // Others
    'application/vnd.google-earth.kml+xml': 'kml',
    'application/vnd.google-earth.kmz': 'kmz',
    'application/x-httpd-php': 'php',
    'application/x-latex': 'latex',
    'application/x-sql': 'sql',
    'application/x-tex': 'tex'
};

export default mimeTypes;
