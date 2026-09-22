import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("generation is submitted once from the loading page", async () => {
    const mainHtml = await readFile(new URL("../public/main.html", import.meta.url), "utf8");
    const generatingHtml = await readFile(new URL("../public/generating.html", import.meta.url), "utf8");

    assert.doesNotMatch(mainHtml, /fetch\("\/"/);
    assert.match(generatingHtml, /fetch\("\/"/);
    assert.doesNotMatch(generatingHtml, /fetch\(["']\/chord_gen\//);
    assert.match(generatingHtml, /window\.location\.href = "response\.html"/);
});
