from rest_framework import serializers
from bs4 import BeautifulSoup


class NewsSerializer(serializers.Serializer):
    title = serializers.CharField()
    content = serializers.CharField()
    image = serializers.CharField(allow_null=True, required=False)
    link = serializers.CharField()
    created_at = serializers.CharField()

    @staticmethod
    def extract_image(entry):
        if 'summary' in entry:
            soup = BeautifulSoup(entry.summary, 'html.parser')
            img = soup.find('img')

            if img and img.get('src'):
                return img.get('src')

        if 'media_content' in entry:
            return entry.media_content[0].get('url')

        if 'media_thumbnail' in entry:
            return entry.media_thumbnail[0].get('url')

        return None

    @staticmethod
    def clean_html(html):
        soup = BeautifulSoup(html, "html.parser")
        return soup.get_text()

    @classmethod
    def from_rss_entry(cls, entry):
        return {
            "title": getattr(entry, "title", ""),
            "content": cls.clean_html(
                getattr(entry, "summary", "")
            ),
            "image": cls.extract_image(entry),
            "link": getattr(entry, "link", ""),
            "created_at": getattr(entry, "published", "")
        }