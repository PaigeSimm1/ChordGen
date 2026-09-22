const allowedSortColumns = new Set([
    "bpm",
    "scale",
    "style",
    "time_signature",
    "created_at"
]);

const allowedSortOrders = new Set(["ASC", "DESC"]);

export function buildChordSearchQuery(search = {}) {
    let sql = `
        SELECT
            chords,
            bpm,
            scale,
            style,
            time_signature,
            created_at
        FROM chord_gen
    `;

    const filters = [];
    const parameters = [];

    for (const column of ["bpm", "scale", "style", "time_signature"]) {
        if (search[column]) {
            filters.push(`${column} = ?`);
            parameters.push(search[column]);
        }
    }

    if (filters.length > 0) {
        sql += ` WHERE ${filters.join(" AND ")}`;
    }

    if (allowedSortColumns.has(search.sort_by)) {
        const sortOrder = allowedSortOrders.has(search.sort_order)
            ? search.sort_order
            : "ASC";

        sql += ` ORDER BY ${search.sort_by} ${sortOrder}`;
    }

    const requestedLimit = Number.parseInt(search.limit, 10);
    const limit = Number.isInteger(requestedLimit)
        && requestedLimit >= 1
        && requestedLimit <= 10
        ? requestedLimit
        : 10;

    sql += ` LIMIT ${limit}`;

    return { sql, parameters };
}
