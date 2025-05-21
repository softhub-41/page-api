const scrollGallery = document.getElementById('scrollGallery');
const scrollAmount = 320; // Amount to scroll in px

// Left and right scroll buttons functionality
document.querySelector('.scroll-btn.left').addEventListener('click', () => {
  scrollGallery.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});

document.querySelector('.scroll-btn.right').addEventListener('click', () => {
  scrollGallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});


// Finnhub API Integration

const FINNHUB_API_KEY = 'd0je921r01ql09hrtp3gd0je921r01ql09hrtp40';

// Map UI market buttons to Finnhub categories
const MARKETS = {
  GLOBAL: 'general',
  US: 'forex',
  CRYPTO: 'crypto'
};

function getNewsEndpoint(category) {
  return `https://finnhub.io/api/v1/news?category=${category}&token=${FINNHUB_API_KEY}`;
}

function isAsianMarketNews(news) {
  // Keywords for Asian markets
  const keywords = [
    'asia', 'asian', 'japan', 'nikkei', 'china', 'shanghai', 'hong kong', 'hsi', 'korea', 'kospi', 'taiwan', 'india', 'sensex', 'nifty', 'singapore', 'jakarta', 'malaysia', 'thailand', 'philippines', 'bursa'
  ];
  const text = `${news.headline} ${news.summary} ${news.source}`.toLowerCase();
  return keywords.some(keyword => text.includes(keyword));
}

async function fetchNews(category = MARKETS.GLOBAL) {
  const newsContainer = document.getElementById('newsContainer');
  newsContainer.innerHTML = '<div style="text-align: center">Loading market news...</div>';

  try {
    const endpoint = getNewsEndpoint(category);
    const response = await fetch(endpoint);
    const data = await response.json();

    let filteredData = data;
    if (category === 'asia') {
      filteredData = Array.isArray(data) ? data.filter(isAsianMarketNews) : [];
    }

    if (!Array.isArray(filteredData) || filteredData.length === 0) {
      newsContainer.innerHTML = '<div>No news available for this market</div>';
      return;
    }

    updateNewsDisplay(filteredData);
  } catch (error) {
    console.error('Error fetching market news:', error);
    newsContainer.innerHTML = `<div style="color: red;">Error loading market news: ${error.message}</div>`;
  }
}

function formatTimeAgo(timestamp) {
  const now = new Date();
  const posted = new Date(timestamp * 1000); // Finnhub uses Unix timestamp
  const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours === 1) return '1 hour ago';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  return `${Math.floor(diffInHours / 24)} days ago`;
}

function createNewsItem(news) {
  const newsItem = document.createElement('div');
  newsItem.className = 'news-article';

  const defaultImg = 'https://cdn-icons-png.flaticon.com/512/21/21601.png';
  const imgSrc =
    news.image && news.image !== '' && news.image !== 'null'
      ? news.image
      : defaultImg;

  newsItem.innerHTML = `
    <img src="${imgSrc}" alt="news image" onerror="this.onerror=null;this.src='${defaultImg}';">
    <h3><a href="${news.url}" target="_blank" style="color:inherit;text-decoration:none;">${news.headline}</a></h3>
    <p>${news.summary ? news.summary.substring(0, 120) + '...' : ''}</p>
    <div style="font-size:12px;color:#888;margin-top:8px;">
      ${news.source} · ${formatTimeAgo(news.datetime)}
    </div>
  `;
  return newsItem;
}

function updateNewsDisplay(newsData) {
  const newsContainer = document.getElementById('newsContainer');
  newsContainer.innerHTML = ''; // Clear existing news

  if (!Array.isArray(newsData) || newsData.length === 0) {
    newsContainer.innerHTML = '<div>No news available for this market</div>';
    return;
  }

  newsData.slice(0, 9).forEach(news => {
    const newsItem = createNewsItem(news);
    newsContainer.appendChild(newsItem);
  });
}

// Market selector event handling
document.addEventListener('DOMContentLoaded', () => {
  // Market News section logic
  const marketBtns = document.querySelectorAll('.market-selector .market-btn');
  marketBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      marketBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const market = this.dataset.market;
      fetchNews(market);
    });
  });

  // Initial load: Global news
  fetchNews(MARKETS.GLOBAL);
});

// Update news every 5 minutes
setInterval(() => {
  // Find the active market
  const activeBtn = document.querySelector('.market-selector .market-btn.active');
  const market = activeBtn ? activeBtn.dataset.market : MARKETS.GLOBAL;
  fetchNews(market);
}, 5 * 60 * 1000);

const indexData = [
  { name: 'S&P 500', last: '5,916.93', change: '+24.35', percentChange: '+0.41' },
  { name: 'NASDAQ', last: '19,112.32', change: '-34.49', percentChange: '-0.18' },
  { name: 'DJIA', last: '42,322.75', change: '+271.69', percentChange: '+0.65' },
  { name: 'FTSE', last: '8,670.46', change: '+36.71', percentChange: '+0.43' },
  { name: 'NIKKEI', last: '37,753.72', change: '-1.79', percentChange: '0.00' },
  { name: 'HSI', last: '23,344.27', change: '-108.89', percentChange: '-0.46' },
  { name: 'SHANGHAI', last: '3,367.46', change: '-13.36', percentChange: '-0.40' },
  { name: 'VIX', last: '17.84', change: '+0.01', percentChange: '+0.06' },
  { name: 'DAX', last: '23,821.30', change: '+125.71', percentChange: '+0.53' }
];

function populateIndexesTable() {
  const tbody = document.getElementById('indexesTableBody');
  tbody.innerHTML = indexData.map(index => `
        <tr>
            <td>${index.name}</td>
            <td>${index.last}</td>
            <td class="${index.change.startsWith('+') ? 'positive' : 'negative'}">
                ${index.change}
            </td>
            <td class="${index.percentChange.startsWith('+') ? 'positive' : 'negative'}">
                ${index.percentChange}${index.percentChange !== '0.00' ? '%' : ''}
            </td>
        </tr>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  populateIndexesTable();
});








