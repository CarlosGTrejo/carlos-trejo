import { toc } from 'mdast-util-toc';

export default function remarkTocCollapsible(options) {
    const settings = {
        ...options,
        heading: (options && options.heading) || '(table[ -]of[ -])?contents?|toc',
        tight: options && typeof options.tight === 'boolean' ? options.tight : true
    };

    return function (tree) {
        const result = toc(tree, settings);

        if (
            result.endIndex === undefined ||
            result.endIndex === -1 ||
            result.index === undefined ||
            result.index === -1 ||
            !result.map
        ) {
            return;
        }

        // Wrap the TOC in a collapsible details element
        const collapsibleToc = {
            type: 'html',
            value: '<details>\n<summary>Table of Contents</summary>\n'
        };

        const closingTag = {
            type: 'html',
            value: '</details>'
        };

        // Find and remove the TOC heading if it exists
        let startIndex = result.index;
        if (startIndex > 0 && tree.children[startIndex - 1]?.type === 'heading') {
            // Check if the previous element is the TOC heading
            const headingNode = tree.children[startIndex - 1];
            const headingText = headingNode.children?.[0]?.value?.toLowerCase() || '';
            const tocPattern = /(table[ -]of[ -])?contents?|toc/i;

            if (tocPattern.test(headingText)) {
                startIndex = startIndex - 1; // Include the heading in removal
            }
        }

        tree.children = [
            ...tree.children.slice(0, startIndex),
            collapsibleToc,
            result.map,
            closingTag,
            ...tree.children.slice(result.endIndex)
        ];
    };
}
