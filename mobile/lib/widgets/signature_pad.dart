import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'dart:io';

class SignaturePad extends StatefulWidget {
  final Function(Uint8List) onSave;
  const SignaturePad({required this.onSave, super.key});

  @override
  State<SignaturePad> createState() => _SignaturePadState();
}

class _SignaturePadState extends State<SignaturePad> {
  final _points = <Offset?>[];
  final _repaint = ValueNotifier<int>(0);

  Future<void> _exportPng() async {
    final recorder = ui.PictureRecorder();
    final canvas = Canvas(recorder);
    final paintBg = Paint()..color = Colors.white;
    final size = context.size ?? const Size(400, 300);
    canvas.drawRect(Offset.zero & size, paintBg);

    final paint = Paint()
      ..color = Colors.black
      ..strokeCap = StrokeCap.round
      ..strokeWidth = 3.0;

    for (int i = 0; i < _points.length - 1; i++) {
      final p1 = _points[i];
      final p2 = _points[i + 1];
      if (p1 != null && p2 != null) {
        canvas.drawLine(p1, p2, paint);
      }
    }

    final picture = recorder.endRecording();
    final img = await picture.toImage(size.width.toInt(), size.height.toInt());
    final byteData = await img.toByteData(format: ui.ImageByteFormat.png);
    if (byteData == null) return;
    final bytes = byteData.buffer.asUint8List();

    // save to local file
    final dir = await getApplicationDocumentsDirectory();
    final file = File(p.join(dir.path, 'signature_${DateTime.now().millisecondsSinceEpoch}.png'));
    await file.writeAsBytes(bytes);

    widget.onSave(bytes);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        GestureDetector(
          onPanUpdate: (details) {
            final Offset point = details.localPosition;
            _points.add(point);
            _repaint.value++;
          },
          onPanEnd: (details) {
            _points.add(null);
            _repaint.value++;
          },
          child: Container(
            width: double.infinity,
            height: 300,
            color: Colors.grey[200],
            child: ValueListenableBuilder<int>(
              valueListenable: _repaint,
              builder: (context, _, __) => RepaintBoundary(
                child: ExcludeSemantics(
                  child: CustomPaint(
                    painter: _SignaturePainter(points: _points),
                  ),
                ),
              ),
            ),
          ),
        ),
        Row(
          children: [
            ElevatedButton(
              onPressed: () {
                _points.clear();
                _repaint.value++;
              },
              child: const Text('Clear'),
            ),
            const SizedBox(width: 12),
            ElevatedButton(
              onPressed: _exportPng,
              child: const Text('Save PNG'),
            ),
          ],
        )
      ],
    );
  }
}

class _SignaturePainter extends CustomPainter {
  final List<Offset?> points;
  _SignaturePainter({required this.points});
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.black
      ..strokeCap = StrokeCap.round
      ..strokeWidth = 3.0;
    for (int i = 0; i < points.length - 1; i++) {
      final p1 = points[i];
      final p2 = points[i + 1];
      if (p1 != null && p2 != null) {
        canvas.drawLine(p1, p2, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant _SignaturePainter oldDelegate) => oldDelegate.points != points;
}