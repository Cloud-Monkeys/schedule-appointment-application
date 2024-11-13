const buildLinks = (req, resource, id = null) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const links = {
        self: {
            href: `${baseUrl}/${resource}${id ? `/${id}` : ''}`,
            method: 'GET'
        },
        collection: {
            href: `${baseUrl}/${resource}`,
            method: 'GET'
        }
    };

    if (id) {
        links.update = {
            href: `${baseUrl}/${resource}/${id}`,
            method: 'PUT'
        };
        links.delete = {
            href: `${baseUrl}/${resource}/${id}`,
            method: 'DELETE'
        };
    } else {
        links.create = {
            href: `${baseUrl}/${resource}`,
            method: 'POST'
        };
    }

    return links;
};

module.exports = { buildLinks }; 