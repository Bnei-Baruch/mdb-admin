export function relationshipResponseToPaginated(response, foreignName = '') {
    if (Array.isArray(response.data) && response.data.length) {
        response.data = {
            total: response.data.length,
            data: response.data.map(relationship => {
                const foreignValue = foreignName ? relationship[foreignName] : relationship;

                if (foreignName) {
                    foreignValue.relationshipName = relationship.name;
                }

                return foreignValue;
            })
        }
    } else {
        response.data = {
            data: [],
            total: 0
        }
    }

    console.log(response);

    return response;
};
