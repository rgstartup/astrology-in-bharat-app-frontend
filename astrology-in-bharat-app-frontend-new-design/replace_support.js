const fs = require('fs');
const path = require('path');

const filePath = path.join('apps', 'main', 'app', 'profile', 'page.tsx');

try {
    let content = fs.readFileSync(filePath, 'utf8');
    let lines = content.split('\n');

    // Find start and end dynamically to be safe
    let startLine = -1;
    let endLine = -1;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('activeTab === "support"')) {
            startLine = i + 1;
        }
        if (startLine !== -1 && i > startLine && lines[i].trim() === ')}' && lines[i + 2] && lines[i + 2].includes('Chat History Modal')) {
            // Heuristic: The block ends with )} followed by spacer and potentially Chat History Modal comment (though that changed)
            // Let's use simpler heuristic: End of support tab block.
            // It is followed by closing div of the container.
        }
    }

    // Re-reading Step 334: 
    // 1378: )}
    // 1380: </div>
    // 1383: {/* Chat History Modal... */} (Now replaced by refactored comment)

    // So we look for activeTab === "support"
    // And the corresponding closing )} which is before the closing </div> of the tab-content container.

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('activeTab === "support"')) {
            startLine = i + 1;
            // Find the specific closing brace for this block
            // It should be the first )} at indentation level 12 spaces (approx)
            // lines[i] has 12 spaces indentation.

            for (let j = i + 1; j < lines.length; j++) {
                if (lines[j].trim() === ')}' && lines[j].length === lines[i].length - ('activeTab === "support" && ('.length) + 2) {
                    // Indentation check is tricky.
                    // Let's just scan for the )} before the next major block or end of container.
                }
            }
        }
    }

    // Hardcoded based on shift logic is safer if verified
    // Original 1289 -> 1291 (Import added +1) -> 1292 (Import added +1)
    // Let's assume 1291 or 1292.

    // Let's just find the line index.
    const startIdx = lines.findIndex(l => l.includes('activeTab === "support"'));
    if (startIdx === -1) throw new Error("Could not find support tab start");

    // Find the end. It is the closing )} before the </div> that closes the tabs container.
    // The tabs container closing div is indented.
    // The support tab ends with )}

    // Let's look for the next lines.
    let endIdx = -1;
    for (let i = startIdx; i < lines.length; i++) {
        if (lines[i].trim() === ')}' && lines[i + 1].trim() === '' && lines[i + 2].trim() === '</div>') {
            endIdx = i;
            break;
        }
    }

    if (endIdx === -1) {
        // Try without empty line
        for (let i = startIdx; i < lines.length; i++) {
            if (lines[i].trim() === ')}' && lines[i + 1].trim() === '</div>') {
                endIdx = i;
                break;
            }
        }
    }

    if (endIdx === -1) throw new Error("Could not find support tab end");

    console.log(`Found support block: Lines ${startIdx + 1} to ${endIdx + 1}`);

    const newLines = [
        `            {activeTab === "support" && (`,
        `              <SupportTab supportSettings={supportSettings} />`,
        `            )}`
    ];

    /* 
      Original block was:
      {activeTab === "support" && (
         ... content ...
      )}
    */

    lines.splice(startIdx, endIdx - startIdx + 1, ...newLines);

    fs.writeFileSync(filePath, lines.join('\n'));
    console.log('Successfully replaced SupportTab block.');

} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}
