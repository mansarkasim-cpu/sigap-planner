plugins {
    id("com.android.application")
    id("kotlin-android")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.example.sigap_mobile"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_17.toString()
    }

    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId = "com.example.sigap_mobile"
        // You can update the following values to match your application needs.
        // For more information, see: https://flutter.dev/to/review-gradle-config.
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    buildTypes {
        release {
            // Prefer a release signing config from a key.properties file if present,
            // otherwise fall back to the debug signing config so local release runs still work.
            val keyPropsFile = rootProject.file("key.properties")
            if (keyPropsFile.exists()) {
                val keyProps = java.util.Properties()
                keyProps.load(java.io.FileInputStream(keyPropsFile))

                val storeFilePath = keyProps.getProperty("storeFile") ?: ""
                signingConfigs.create("release") {
                    if (storeFilePath.isNotEmpty()) {
                        storeFile = file(storeFilePath)
                    }
                    storePassword = keyProps.getProperty("storePassword")
                    keyAlias = keyProps.getProperty("keyAlias")
                    keyPassword = keyProps.getProperty("keyPassword")
                }

                signingConfig = signingConfigs.findByName("release") ?: signingConfigs.getByName("debug")
            } else {
                // No key.properties found — use debug signing so `flutter run --release` still works.
                signingConfig = signingConfigs.getByName("debug")
            }
            // Disable code shrinking and resource shrinking so bundled raw sounds are preserved
            isMinifyEnabled = false
            isShrinkResources = false
        }
    }
}

flutter {
    source = "../.."
}

apply(plugin = "com.google.gms.google-services")
