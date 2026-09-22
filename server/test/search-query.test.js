import test from "node:test";
import assert from "node:assert/strict";
import { buildChordSearchQuery } from "../search-query.js";

test("builds the default search safely", () => {
    const { sql, parameters } = buildChordSearchQuery({
        limit: "10",
        sort_order: "ASC"
    });

    assert.match(sql, /FROM chord_gen/);
    assert.match(sql, /LIMIT 10$/);
    assert.doesNotMatch(sql, /ORDER BY/);
    assert.deepEqual(parameters, []);
});

test("parameterizes filters and allows known sorting", () => {
    const { sql, parameters } = buildChordSearchQuery({
        bpm: "120",
        style: "Jazz",
        sort_by: "created_at",
        sort_order: "DESC",
        limit: "5"
    });

    assert.match(sql, /WHERE bpm = \? AND style = \?/);
    assert.match(sql, /ORDER BY created_at DESC/);
    assert.match(sql, /LIMIT 5$/);
    assert.deepEqual(parameters, ["120", "Jazz"]);
});

test("rejects unsafe sorting and out-of-range limits", () => {
    const { sql, parameters } = buildChordSearchQuery({
        sort_by: "bpm; DROP TABLE chord_gen",
        sort_order: "SIDEWAYS",
        limit: "1000"
    });

    assert.doesNotMatch(sql, /ORDER BY/);
    assert.match(sql, /LIMIT 10$/);
    assert.deepEqual(parameters, []);
});
