// /api/github-delete.js — Delete a file from GitHub repo
const https = require('https');

const OWNER = 'kaynarkerem-ai';
const REPO = 'pagus-website';

function githubRequest(path, method, body) {
    return new Promise(function(resolve, reject) {
        const token = process.env.GITHUB_TOKEN;
        if (!token) return reject(new Error('GITHUB_TOKEN not set'));

        const data = body ? JSON.stringify(body) : null;
        const options = {
            hostname: 'api.github.com',
            path: path,
            method: method || 'GET',
            headers: {
                'Authorization': 'token ' + token,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'pagus-admin',
                'Content-Type': 'application/json'
            }
        };
        if (data) options.headers['Content-Length'] = Buffer.byteLength(data);

        const req = https.request(options, function(res) {
            let chunks = [];
            res.on('data', function(chunk) { chunks.push(chunk); });
            res.on('end', function() {
                const raw = Buffer.concat(chunks).toString();
                try { resolve({ status: res.statusCode, data: JSON.parse(raw) }); }
                catch(e) { resolve({ status: res.statusCode, data: raw }); }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Key');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { path, sha, message } = req.body;
    if (!path || !sha) return res.status(400).json({ error: 'path and sha required' });

    try {
        const result = await githubRequest(
            '/repos/' + OWNER + '/' + REPO + '/contents/' + path.split('/').map(function(s){ return encodeURIComponent(s); }).join('/'),
            'DELETE',
            {
                message: message || 'Delete ' + path,
                sha: sha
            }
        );

        if (result.status !== 200) {
            return res.status(result.status).json({ error: 'GitHub API error', detail: result.data });
        }

        return res.status(200).json({ success: true, data: result.data });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
