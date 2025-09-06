import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

const app = express();
app.use(cors()); // in prod, restrict origin

app.get('/api/news', async (req, res) => {
  const q = req.query.q || '';
  const country = 'IN', lang = 'en';
  const url =
    `https://news.google.com/rss/search?q=${encodeURIComponent(q)}` +
    `&hl=${lang}-${country}&gl=${country}&ceid=${country}:${lang}`;

  const upstream = await fetch(url, { headers: { Accept: 'application/rss+xml,text/xml' } });
  if (!upstream.ok) return res.status(upstream.status).json({ error: 'upstream_error' });

  const xml = await upstream.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const data = parser.parse(xml);

  const items = (data?.rss?.channel?.item ?? []).map(i => ({
    title: i.title,
    url: i.link,
    published_at: i.pubDate,
    source: i?.source?.['#text'] ?? ''
  }));

  res.json({ items });
});

app.listen(3001, () => console.log('API on http://localhost:3001'));