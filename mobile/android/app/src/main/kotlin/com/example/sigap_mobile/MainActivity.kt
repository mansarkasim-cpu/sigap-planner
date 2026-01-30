package com.example.sigap_mobile

import android.app.NotificationChannel
import android.app.NotificationManager
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import android.util.Log
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
        val resId = resources.getIdentifier("ship_horn", "raw", applicationContext.packageName)
        if (resId == 0) {
          Log.w("SIGAP", "ship_horn resource not found in res/raw; channel will use default sound")
        } else {
          val soundUri = Uri.parse("android.resource://${applicationContext.packageName}/raw/ship_horn")
          val audioAttributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_NOTIFICATION)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()
          channel.setSound(soundUri, audioAttributes)
          Log.d("SIGAP", "Configured channel sound to ship_horn (resId=$resId)")
        }
      } catch (e: Exception) {
        Log.w("SIGAP", "Failed to set custom channel sound", e)
      }
      
      val nm = getSystemService(NotificationManager::class.java)
      // Delete and recreate the channel so updated sound/importance take effect
      try {
        nm?.deleteNotificationChannel(channelId)
      } catch (e: Exception) {
        Log.w("SIGAP", "Failed to delete existing channel (may not exist)")
      }
      nm?.createNotificationChannel(channel)
      Log.d("SIGAP", "Notification channel '$channelId' created with importance=${channel.importance}")
    }
  }
}
