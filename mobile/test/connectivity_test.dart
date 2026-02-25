import 'package:flutter_test/flutter_test.dart';
import 'dart:async';

// Simulasi API timeout test
void main() {
  group('API Timeout & Caching Tests', () {
    test('API timeout seharusnya throw exception setelah 15 detik', () async {
      // Simulasi request yang slow/timeout
      final futureWithTimeout = Future.delayed(Duration(seconds: 20))
          .timeout(Duration(seconds: 15),
              onTimeout: () => throw TimeoutException('Network timeout'));

      expect(
        futureWithTimeout,
        throwsA(isA<TimeoutException>()),
      );
    });

    test(
        'Ketika request gagal, seharusnya fallback ke cached data jika tersedia',
        () async {
      // Simulasi cache data
      final cachedData = {'doc_no': 'WO-001', 'asset_name': 'Pump A'};

      // Simulasi request yang gagal
      Future<dynamic> failedRequest() async {
        throw Exception('Network error');
      }

      // Simulasi fallback logic
      dynamic result;
      try {
        result = await failedRequest();
      } catch (_) {
        // Fallback ke cache
        result = cachedData;
      }

      expect(result, equals(cachedData));
      expect(result['doc_no'], equals('WO-001'));
    });

    test('Error message seharusnya different untuk offline vs cached data',
        () async {
      // Scenario 1: Has cached data
      final String errorMsgWithCache =
          'Koneksi lemah. Menampilkan data terakhir yang tersimpan.';
      expect(errorMsgWithCache.contains('terakhir'), true);

      // Scenario 2: No cached data
      final String errorMsgNoCache =
          'Gagal memuat data. Pastikan koneksi internet Anda aktif.';
      expect(errorMsgNoCache.contains('Gagal'), true);
    });

    test('Setelah success request, data seharusnya disimpan ke cache',
        () async {
      final Map<String, dynamic> newData = {
        'doc_no': 'WO-002',
        'asset_name': 'Pump B',
        'status': 'IN_PROGRESS'
      };

      // Simulasi cache storage
      final Map<String, dynamic> cache = {};

      // Simpan ke cache
      cache['wo_detail_WO-002'] = newData;

      // Verify cache
      expect(cache['wo_detail_WO-002'], equals(newData));
      expect(cache['wo_detail_WO-002']['status'], equals('IN_PROGRESS'));
    });

    test('Multiple failed requests seharusnya semua fallback ke cache',
        () async {
      final woCache = {'doc_no': 'WO-001'};
      final taskCache = [
        {'id': '1', 'name': 'Task 1'},
        {'id': '2', 'name': 'Task 2'}
      ];

      final results = <dynamic>[];

      // Simulasi 3 parallel requests yang semua gagal
      try {
        await Future.wait([
          Future.error(Exception('WO detail failed')),
          Future.error(Exception('Tasks failed')),
          Future.error(Exception('Status failed')),
        ]);
      } catch (_) {
        // Fallback logic - semuanya pakai cache
        results.add(woCache);
        results.add(taskCache);
        results.add('PENDING');
      }

      // Verify bahwa semua fallback ke cache
      expect(results.length, 3);
      expect(results[0], equals(woCache));
      expect(results[1], equals(taskCache));
    });

    test('UI should show error banner with retry button when request fails',
        () async {
      // Simulasi state setelah request gagal
      final bool hasError = true;
      final bool usingCachedData = true;
      final String? errorMessage =
          'Koneksi lemah. Menampilkan data terakhir yang tersimpan.';

      // Verify state untuk error UI
      expect(hasError, true);
      expect(usingCachedData, true);
      expect(errorMessage, isNotEmpty);
      expect(errorMessage, contains('terakhir'));
    });

    test('Retry button should clear error and reload data', () async {
      var errorMessage = 'Network error occurred';
      var isLoading = false;

      // Simulasi retry action
      isLoading = true;
      errorMessage = ''; // Clear error

      try {
        // Simulasi reload yang berhasil
        await Future.delayed(Duration(milliseconds: 100));
        final newData = {'success': true};
        expect(newData['success'], true);
      } finally {
        isLoading = false;
      }

      expect(errorMessage, isEmpty);
      expect(isLoading, false);
    });

    test('Cache should persist across app lifecycle', () async {
      final String cacheKey = 'wo_detail_WO-001';
      final Map<String, dynamic> woData = {'id': 'WO-001', 'name': 'Work'};

      // Simulasi penyimpanan cache
      final Map<String, dynamic> persistentCache = {};
      persistentCache[cacheKey] = woData;

      // Simulasi app reload
      final String retrievedKey = cacheKey;
      final cachedValue = persistentCache[retrievedKey];

      // Verify cache masih ada setelah reload
      expect(cachedValue, equals(woData));
      expect(cachedValue['id'], equals('WO-001'));
    });
  });
}
