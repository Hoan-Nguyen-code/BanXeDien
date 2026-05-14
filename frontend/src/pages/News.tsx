import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import "../assets/css/news.css";

import {
  type NewsItem,
  loadNews,
  stripHTML,
  largeImages,
  smallImages,
  getImage,
} from "../assets/js/news";

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await loadNews();

        if (!data || data.length === 0) {
          setError("Không có tin tức.");
          return;
        }

        setNews(data);
      } catch (err) {
        console.error(err);
        setError("❌ Lỗi tải Google News!");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const featured = news[0];
  const featuredImg = largeImages[0];

  return (
    <MainLayout>
      {/* TITLE */}
      <h1 className="news-title">
        <i className="fas fa-newspaper"></i> Tin nổi nhất hiện nay 🔥
      </h1>

      {/* LOADING */}
      {loading && (
        <div id="loading" className="loading">
          Đang tải tin tức từ Google News...
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div id="loading" className="loading">
          {error}
        </div>
      )}

      {/* CONTENT */}
      {!loading && !error && (
        <>
          {/* LAYOUT */}
          <div className="news-layout">
            {/* LEFT */}
            <div className="news-left" id="newsLeft">
              {news.slice(1, 10).map((item, index) => {
                const fallbackImg = smallImages[index];

                return (
                  <div
                    key={index}
                    className="news-item"
                    onClick={() => window.open(item.link, "_blank")}
                  >
                    <img
                      src={getImage(item.image, fallbackImg)}
                      alt={item.title || ""}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = fallbackImg;
                      }}
                    />

                    <h4>{item.title || ""}</h4>
                  </div>
                );
              })}
            </div>

            {/* RIGHT */}
            <div className="news-right" id="newsRight">
              {featured && (
                <div
                  className="featured-news"
                  onClick={() => window.open(featured.link, "_blank")}
                >
                  <img
                    src={getImage(featured.image, featuredImg)}
                    alt={featured.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = featuredImg;
                    }}
                  />

                  <div className="featured-content">
                    <h2>{featured.title || ""}</h2>

                    <p>
                      {stripHTML(featured.content || "").substring(0, 150)}
                      ...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* GRID */}
          <div className="news-grid" id="newsGrid">
            {news.slice(10, 20).map((item, index) => {
              const fallbackImg =
                smallImages[index + 9] ||
                smallImages[index % smallImages.length];

              return (
                <div
                  key={index}
                  className="news-card"
                  onClick={() => window.open(item.link, "_blank")}
                >
                  <img
                    src={getImage(item.image, fallbackImg)}
                    alt={item.title || ""}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = fallbackImg;
                    }}
                  />

                  <div className="news-card-content">
                    <h3>{item.title || ""}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </MainLayout>
  );
}
