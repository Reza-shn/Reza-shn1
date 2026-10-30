plugins { id("com.android.application") }

val tapsellVersion = "1.4.0-alpha04"

android {
    namespace = "com.coralplayer.app"
    compileSdk = 35
    defaultConfig {
        applicationId = "com.coralplayer.app"
        minSdk = 23
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
        manifestPlaceholders["TapsellMediationAppKey"] = "00000000-0000-0000-0000-000000000000"
    }
    buildTypes { release { isMinifyEnabled = false } }
    flavorDimensions += "store"
    productFlavors {
        create("myket") {
            dimension = "store"
            manifestPlaceholders["marketApplicationId"] = "ir.mservices.market"
            manifestPlaceholders["marketBindAddress"] = "ir.mservices.market.InAppBillingService.BIND"
            manifestPlaceholders["marketPermission"] = "ir.mservices.market.BILLING"
        }
        create("bazaar") {
            dimension = "store"
            manifestPlaceholders["marketApplicationId"] = "com.farsitel.bazaar"
            manifestPlaceholders["marketBindAddress"] = "ir.cafebazaar.pardakht.InAppBillingService.BIND"
            manifestPlaceholders["marketPermission"] = "com.farsitel.bazaar.permission.PAY_THROUGH_BAZAAR"
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    lint { checkReleaseBuilds = false; abortOnError = false }
}

dependencies {
    implementation("ir.tapsell:tapsell:$tapsellVersion")
    implementation("ir.tapsell.mediation.adapter:legacy:$tapsellVersion")
    implementation("com.google.android.gms:play-services-appset:16.1.0")
    implementation("com.google.android.gms:play-services-ads-identifier:18.2.0")
    implementation("com.github.myketstore:myket-billing-client:v1.3")
}

tasks.register("collectLibs") {
    doLast {
        val cfg = configurations.getByName("myketReleaseRuntimeClasspath")
        val out = rootProject.file("out/libs")
        out.mkdirs()
        for (type in listOf("aar", "jar")) {
            cfg.incoming.artifactView {
                attributes { attribute(Attribute.of("artifactType", String::class.java), type) }
                lenient(true)
            }.artifacts.forEach { a ->
                val name = a.id.componentIdentifier.displayName.replace(':', '_').replace('/', '_')
                a.file.copyTo(File(out, "$name.$type"), overwrite = true)
            }
        }
    }
}
