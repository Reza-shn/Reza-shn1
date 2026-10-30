pluginManagement {
    repositories { google(); mavenCentral(); gradlePluginPortal() }
}
dependencyResolutionManagement {
    repositories {
        maven { url = uri("https://maven.tapsell.ir") }
        google()
        mavenCentral()
    }
}
rootProject.name = "coral-libs"
include(":app")
