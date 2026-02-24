import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';

/// Compress image bytes using flutter_image_compress.
/// Returns compressed bytes or original bytes if compression fails.
Future<Uint8List> compressImageBytes(Uint8List bytes,
    {int quality = 80, int maxWidth = 1280, bool toWebP = true}) async {
  try {
    final format = toWebP ? CompressFormat.webp : CompressFormat.jpeg;
    // run compression in background
    final result = await compute(_compressInIsolate,
        _CompressParams(bytes, quality, maxWidth, format));
    if (result != null && result.isNotEmpty) return result;
  } catch (e) {
    // ignore and return original
  }
  return bytes;
}

class _CompressParams {
  final Uint8List bytes;
  final int quality;
  final int maxWidth;
  final CompressFormat format;
  _CompressParams(this.bytes, this.quality, this.maxWidth, this.format);
}

Future<Uint8List?> _compressInIsolate(_CompressParams params) async {
  try {
    final out = await FlutterImageCompress.compressWithList(
      params.bytes,
      quality: params.quality,
      minWidth: params.maxWidth,
      format: params.format,
    );
    return out;
  } catch (e) {
    return null;
  }
}
