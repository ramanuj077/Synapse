const express = require('express');
const router = express.Router();
const { Octokit } = require('octokit');
// Safe middleware import
let optionalAuth = (req, res, next) => next();
try {
    const auth = require('../middleware/auth');
    if (auth.optionalAuth) optionalAuth = auth.optionalAuth;
} catch (e) { }
const pipeline = require('../src/pipeline/refactor.pipeline');
const repository = require('../src/db/refactor.repository');

// Initialize Octokit (can use auth token if available in env, or anonymous with lower limits)
// For a production app, we would use a GitHub App or Personal Access Token
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

router.post('/analyze', optionalAuth, async (req, res) => {
    const { repoUrl, preferences } = req.body;

    if (!repoUrl || !repoUrl.includes('github.com')) {
        return res.status(400).json({ error: 'Invalid GitHub URL' });
    }

    console.log(`📂 Analyzing Repository: ${repoUrl}`);

    try {
        // Parse owner and repo from URL
        // Format: https://github.com/owner/repo
        const parts = repoUrl.split('github.com/')[1].split('/');
        const owner = parts[0];
        const repo = parts[1].replace('.git', '');

        console.log(`   Owner: ${owner}, Repo: ${repo}`);

        // 1. Fetch Repository Info
        const { data: repoInfo } = await octokit.request('GET /repos/{owner}/{repo}', {
            owner,
            repo
        });

        // 2. Fetch File Tree (Recursive)
        // Note: Using the default branch
        const { data: treeData } = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1', {
            owner,
            repo,
            tree_sha: repoInfo.default_branch
        });

        // 3. Filter Source Files
        const supportedExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.go', '.rs'];
        const sourceFiles = treeData.tree.filter(item => {
            if (item.type !== 'blob') return false;
            // Ignore node_modules, dist, etc.
            if (item.path.includes('node_modules') || item.path.includes('dist/') || item.path.includes('build/')) return false;

            const ext = item.path.slice(item.path.lastIndexOf('.'));
            return supportedExtensions.includes(ext);
        });

        console.log(`   Found ${sourceFiles.length} source files.`);

        // 4. Select Candidate Files (Strategy: Top 3 largest/most complex or just first 3 for MVP)
        // Sorting by size usually gives 'meaty' files, but let's just take the first few 'src/' files if possible
        let candidates = sourceFiles.filter(f => f.path.startsWith('src/') || f.path.startsWith('lib/'));
        if (candidates.length === 0) candidates = sourceFiles; // Fallback

        const filesToAnalyze = candidates.slice(0, 3); // LIMIT TO 3 for Speed/Quota

        console.log(`   Selected ${filesToAnalyze.length} files for AI Analysis...`);

        // 5. Analyze Content
        const results = [];
        for (const file of filesToAnalyze) {
            console.log(`   Processing: ${file.path}...`);

            // Fetch content blob
            // We can fetch raw content via the 'url' provided in tree, but simpler to use raw.githubusercontent
            const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${repoInfo.default_branch}/${file.path}`;
            const fetchRes = await fetch(rawUrl);
            const content = await fetchRes.text();

            // Run AI Refactoring Using New Pipeline
            try {
                // Determine language based on file extension
                const analysisRef = await pipeline.run(content, file.path, preferences?.refactorType || 'clean-code');

                // SAVE TO DB
                await repository.save(analysisRef, req.user?.id);

                results.push({
                    path: file.path,
                    original: content,
                    analysis: analysisRef
                });
            } catch (err) {
                console.error(`   Failed to analyze ${file.path}:`, err.message);
                results.push({
                    path: file.path,
                    error: err.message
                });
            }
        }

        // 6. Aggregate Results
        const responseData = {
            repo: `${owner}/${repo}`,
            files_analyzed: results.length,
            total_smells: results.reduce((acc, curr) => acc + (curr.analysis?.smell_detected ? 1 : 0), 0),
            results: results
        };

        res.json(responseData);

    } catch (error) {
        console.error("❌ Repo Analysis Failed:", error);
        res.status(500).json({ error: "Repository Analysis Failed: " + error.message });
    }
});

module.exports = router;
