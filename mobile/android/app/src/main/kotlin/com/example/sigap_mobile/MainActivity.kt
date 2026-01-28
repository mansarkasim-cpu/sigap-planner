package com.example.sigap_mobile

import android.app.NotificationChannel
import android.app.NotificationManager
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine

class MainActivity : FlutterActivity() {
  override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
    super.configureFlutterEngine(flutterEngine)
    createHighAlertChannel()
  }

  private fun createHighAlertChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channelId = "high_alerts"
      val name = "High Priority Alerts"
      val descriptionText = "Loud alarm channel for SIGAP notifications"
      val channel = NotificationChannel(channelId, name, NotificationManager.IMPORTANCE_MAX)
      channel.description = descriptionText
      channel.setShowBadge(true)
      
      try {
        val soundUri = Uri.parse("android.resource://${applicationContext.packageName}/raw/ship_horn")
        val audioAttributes = AudioAttributes.Builder()
          .setUsage(AudioAttributes.USAGE_NOTIFICATION)
          .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
          .build()
        channel.setSound(soundUri, audioAttributes)
      } catch (e: Exception) {
        // If ship_horn.wav is not found, channel will use default sound
      }
      
      val nm = getSystemService(NotificationManager::class.java)
      nm?.createNotificationChannel(channel)
    }
  }
}
