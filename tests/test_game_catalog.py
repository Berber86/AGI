"""Regression checks for the checked-in, build-free games landing page."""
from html.parser import HTMLParser
from pathlib import Path
import json
import unittest
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Tags(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.tags = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


class GameCatalogTests(unittest.TestCase):
    def test_white_night_card_links_to_published_game(self):
        tags = Tags((ROOT / 'index.html').read_text()).tags
        links = [a['href'] for t, a in tags if t == 'a' and 'white-night' in a.get('href', '')]
        self.assertEqual(links, ['./games/white-night/play/index.html'] * 2)
        for link in links:
            self.assertTrue((ROOT / link).is_file())
        images = [a for t, a in tags if t == 'img' and 'white-night' in a.get('src', '')]
        self.assertEqual(len(images), 1)
        self.assertTrue((ROOT / images[0]['src']).is_file())
        self.assertTrue(images[0].get('alt'))

    def test_published_html_has_local_bundled_assets(self):
        base = ROOT / 'games/white-night/play'
        tags = Tags((base / 'index.html').read_text()).tags
        scripts = [a for t, a in tags if t == 'script' and a.get('type') == 'module']
        self.assertEqual(len(scripts), 1)
        self.assertTrue(scripts[0]['src'].startswith('./assets/'))
        for tag, attrs in tags:
            for attr in ('src', 'href'):
                value = attrs.get(attr, '')
                if not value or value.startswith('#'):
                    continue
                self.assertFalse(urlsplit(value).netloc, value)
                asset = base / urlsplit(value).path
                self.assertTrue(asset.exists(), str(asset))
        self.assertNotIn('src/main.js', (base / 'index.html').read_text())

    def test_published_pwa_assets_exist(self):
        base = ROOT / 'games/white-night/play'
        manifest = json.loads((base / 'manifest.webmanifest').read_text())
        self.assertEqual(manifest['scope'], './')
        for icon in manifest['icons']:
            self.assertTrue((base / icon['src']).is_file())
        self.assertTrue((base / 'sw.js').is_file())

    def test_hermitage_hall_card_links_to_published_game(self):
        tags = Tags((ROOT / 'index.html').read_text()).tags
        links = [a['href'] for t, a in tags if t == 'a' and 'games/hermitage-hall' in a.get('href', '')]
        self.assertEqual(links, ['./games/hermitage-hall/play/index.html'] * 2)
        for link in links:
            self.assertTrue((ROOT / link).is_file(), link)
        images = [a for t, a in tags if t == 'img' and 'hermitage-hall' in a.get('src', '')]
        self.assertEqual(len(images), 1)
        self.assertTrue((ROOT / images[0]['src']).is_file())
        self.assertTrue(images[0].get('alt'))

    def test_asteroid_turret_card_links_to_published_game_and_cover(self):
        tags = Tags((ROOT / 'index.html').read_text()).tags
        links = [a['href'] for t, a in tags if t == 'a' and 'asteroid-turret-vr' in a.get('href', '')]
        self.assertEqual(links, ['./games/asteroid-turret-vr/play/index.html'] * 2)
        for link in links:
            self.assertTrue((ROOT / link).is_file())
        images = [a for t, a in tags if t == 'img' and 'asteroid-turret-vr' in a.get('src', '')]
        self.assertEqual(len(images), 1)
        self.assertTrue((ROOT / images[0]['src']).is_file())
        self.assertTrue(images[0].get('alt'))

    def test_hermitage_hall_published_build_is_self_contained(self):
        base = ROOT / 'games/hermitage-hall/play'
        tags = Tags((base / 'index.html').read_text()).tags
        scripts = [a for t, a in tags if t == 'script' and a.get('type') == 'module']
        self.assertEqual(len(scripts), 1)
        self.assertTrue(scripts[0]['src'].startswith('./assets/'))
        for tag, attrs in tags:
            for attr in ('src', 'href'):
                value = attrs.get(attr, '')
                if not value or value.startswith('#') or value.startswith('data:'):
                    continue
                self.assertFalse(urlsplit(value).netloc, value)
                asset = base / urlsplit(value).path
                self.assertTrue(asset.exists(), str(asset))
        self.assertNotIn('src/main.js', (base / 'index.html').read_text())

    def test_hermitage_hall_pwa_assets_and_artworks_exist(self):
        base = ROOT / 'games/hermitage-hall/play'
        manifest = json.loads((base / 'manifest.webmanifest').read_text())
        self.assertEqual(manifest['scope'], './')
        for icon in manifest['icons']:
            self.assertTrue((base / icon['src']).is_file())
        self.assertTrue((base / 'sw.js').is_file())
        artworks = sorted((base / 'art').glob('*.webp'))
        self.assertEqual(len(artworks), 6)
        for artwork in artworks:
            self.assertGreater(artwork.stat().st_size, 40_000, artwork.name)
        sculptures = sorted((base / 'sculpture').glob('*.json'))
        self.assertEqual({p.name for p in sculptures}, {'venus-de-milo.json', 'homer.json'})

    def test_asteroid_turret_published_pwa_assets_exist(self):
        base = ROOT / 'games/asteroid-turret-vr/play'
        manifest = json.loads((base / 'manifest.webmanifest').read_text())
        self.assertEqual(manifest['scope'], './')
        for icon in manifest['icons']:
            self.assertTrue((base / icon['src']).is_file())
        self.assertTrue((base / 'sw.js').is_file())
        html = (base / 'index.html').read_text()
        self.assertIn('./assets/', html)
        self.assertNotIn('src/main.js', html)

    def test_gesture_diagnostic_room_uses_production_mediapipe_detector(self):
        tags = Tags((ROOT / 'index.html').read_text()).tags
        links = [a.get('href') for t, a in tags if t == 'a']
        stand = './games/candy-kingdom-coaster/gesture-stand/index.html'
        self.assertEqual(links.count(stand), 2)
        self.assertTrue((ROOT / stand).is_file())
        html = (ROOT / stand).read_text()
        self.assertIn("from '../src/camtrack.js'", html)
        self.assertIn('new CamTracker()', html)
        self.assertIn('useWorkerMode()', html)
        self.assertIn('landmarks', html)
        self.assertIn('categories', html)
        tracker = (ROOT / 'games/candy-kingdom-coaster/src/camtrack.js').read_text()
        self.assertIn("facingMode: { exact: 'environment' }", tracker)
        self.assertIn('stable-v', html)
        self.assertIn('stable-thumb', html)
        sw = (ROOT / 'games/candy-kingdom-coaster/sw.js').read_text()
        self.assertIn("'./gesture-stand/index.html'", sw)
        self.assertIn("ckc-v56", sw)
        self.assertIn("ckc-ml-mediapipe-1.1.1", sw)
        self.assertIn("./vendor/mediapipe/vision_bundle.mjs", sw)
        self.assertIn("'./src/gyro.js'", sw)
        self.assertIn("'./src/fusionlook.js'", sw)

    def test_pelagic_eye_card_links_to_published_game_and_cover(self):
        tags = Tags((ROOT / 'index.html').read_text()).tags
        links = [a.get('href') for t, a in tags if t == 'a' and 'pelagic-eye' in a.get('href', '')]
        self.assertEqual(links, ['./games/pelagic-eye/play/index.html'] * 2)
        for link in links:
            self.assertTrue((ROOT / link).is_file())
        images = [a for t, a in tags if t == 'img' and 'pelagic-eye' in a.get('src', '')]
        self.assertEqual(len(images), 1)
        self.assertTrue((ROOT / images[0]['src']).is_file())
        self.assertTrue(images[0].get('alt'))

    def test_pelagic_eye_published_page_is_single_file(self):
        base = ROOT / 'games/pelagic-eye/play'
        tags = Tags((base / 'index.html').read_text()).tags
        scripts = [a for t, a in tags if t == 'script']
        self.assertEqual(len(scripts), 1)
        self.assertEqual(scripts[0].get('type'), 'module')
        self.assertFalse(scripts[0].get('src'))
        self.assertEqual(sum(1 for t, _ in tags if t == 'style'), 1)
        for tag, attrs in tags:
            for attr in ('src', 'href'):
                value = attrs.get(attr, '')
                if not value or value.startswith('#'):
                    continue
                self.assertFalse(urlsplit(value).netloc, value)
                self.assertFalse(value.startswith(('http:', 'https:')), value)
        self.assertNotIn('src/main.tsx', (base / 'index.html').read_text())

    def test_previous_game_is_still_linked(self):
        tags = Tags((ROOT / 'index.html').read_text()).tags
        links = [a.get('href') for t, a in tags if t == 'a']
        self.assertIn('./games/candy-kingdom-coaster/index.html', links)


if __name__ == '__main__':
    unittest.main()
