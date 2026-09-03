const fs = require('fs');

async function updateTopFollowers() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  const url = 'https://api.github.com/search/users?q=location:"Sri+Lanka"&sort=followers&order=desc&per_page=100';

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Node-Fetch-Script',
        ...(GITHUB_TOKEN && { 'Authorization': `Bearer ${GITHUB_TOKEN}` })
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const formattedUsers = (data.items || []).map((user, index) => ({
      rank: index + 1,
      username: user.login,
      avatar_url: user.avatar_url,
      profile_url: user.html_url,
      id: user.id
    }));

    const outputData = {
      last_updated: new Date().toISOString(),
      total_count: formattedUsers.length,
      users: formattedUsers
    };

    // JSON file එක write කිරීම
    fs.writeFileSync('top_users.json', JSON.stringify(outputData, null, 2));
    console.log('top_users.json successfully created/updated!');

  } catch (error) {
    console.error('Error fetching data:', error);
    process.exit(1);
  }
}

updateTopFollowers();