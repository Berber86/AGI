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

    def test_candy_letters_card_links_to_game_and_cover(self):
        tags = Tags((ROOT / 'index.html').read_text()).tags
        links = [a.get('href') for t, a in tags if t == 'a' and 'candy-letters' in a.get('href', '')]
        self.assertEqual(links, ['./games/candy-letters/play/index.html'] * 2)
        for link in links:
            self.assertTrue((ROOT / link).is_file())
        images = [a for t, a in tags if t == 'img' and 'candy-letters' in a.get('src', '')]
        self.assertEqual(len(images), 1)
        self.assertTrue((ROOT / images[0]['src']).is_file())
        self.assertTrue(images[0].get('alt'))

    def test_candy_letters_page_is_build_free_and_offline(self):
        base = ROOT / 'games/candy-letters/play'
        tags = Tags((base / 'index.html').read_text()).tags
        scripts = [a for t, a in tags if t == 'script']
        self.assertEqual(len(scripts), 1)
        self.assertEqual(scripts[0].get('type'), 'module')
        self.assertTrue(scripts[0]['src'].startswith('./assets/'))
        for tag, attrs in tags:
            for attr in ('src', 'href'):
                value = attrs.get(attr, '')
                if not value or value.startswith('#'):
                    continue
                self.assertFalse(urlsplit(value).netloc, value)
                self.assertTrue((base / urlsplit(value).path).is_file(), value)
        html = (base / 'index.html').read_text()
        self.assertNotIn('http://', html)
        self.assertNotIn('https://', html)

    def test_candy_letters_pwa_assets_exist(self):
        base = ROOT / 'games/candy-letters/play'
        manifest = json.loads((base / 'manifest.webmanifest').read_text())
        self.assertEqual(manifest['scope'], './')
        self.assertEqual(manifest['orientation'], 'landscape')
        self.assertEqual(manifest['lang'], 'ru')
        for icon in manifest['icons']:
            self.assertTrue((base / icon['src']).is_file())
        sw = (base / 'sw.js').read_text()
        for asset in ('./assets/main.js', './assets/state.js', './assets/letters.js',
                      './assets/tracing.js', './assets/render.js', './assets/audio.js',
                      './styles.css', './manifest.webmanifest'):
            self.assertIn(asset, sw)
        self.assertTrue((base / 'cover.png').is_file())

    def test_candy_letters_has_five_letters_and_unit_tests(self):
        letters = (ROOT / 'games/candy-letters/play/assets/letters.js').read_text()
        for glyph in ("'а'", "'о'", "'у'", "'м'", "'с'"):
            self.assertIn(f"id: {glyph}", letters)
        tracing = (ROOT / 'games/candy-letters/play/assets/tracing.js').read_text()
        self.assertIn('export function scoreStroke', tracing)
        self.assertIn('export function scoreAttempt', tracing)
        self.assertNotIn('Math.random(', tracing)
        self.assertTrue((ROOT / 'games/candy-letters/tests/tracing.test.js').is_file())
        self.assertTrue((ROOT / 'games/candy-letters/tests/state.test.js').is_file())
        package = json.loads((ROOT / 'games/candy-letters/package.json').read_text())
        self.assertIn('node --test', package['scripts']['test'])


if __name__ == '__main__':
    unittest.main()
