# How to patch Android app to sniff its HTTPS traffic with self-signed certificate

* Download apktool from https://ibotpeaches.github.io/Apktool/
* Unpack apk file: `java -jar /home/expert/work/tools/apktool.jar d net.flixster.android-9.1.3@APK4Fun.com.apk`
* Modify AndroidManifest.xml by adding `android:networkSecurityConfig="@xml/network_security_config"` attribute to `application` element.
* Create file /res/xml/network_security_config.xml with following content:
```
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config>
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>
</network-security-config>
```
* Build patched apk: `java -jar /home/expert/work/tools/apktool.jar b flixster -o flixster_patched.apk`
* If you see following error try running `java -jar /home/expert/work/tools/apktool.jar empty-framework-dir --force` or run `b` command with parameter `--use-aapt2`
```
W: invalid resource directory name: /home/expert/Downloads/Zzzzzz/Zzzzzz_v0.0.0/res navigation
brut.androlib.AndrolibException: brut.common.BrutException: could not exec (exit code = 1): [/tmp/brut_util_Jar_5815054990385134498.tmp, p, --forced-package-id, 127, --min-sdk-version, 23, --target-sdk-version, 29, --version-code, 226000400, --version-name, 226.000.0, --no-version-vectors, -F, /tmp/APKTOOL14466004687895005947.tmp, -e, /tmp/APKTOOL4388243966604401097.tmp, -0, arsc, -I, /home/expert/.local/share/apktool/framework/1.apk, -S, /home/expert/Downloads/Zzzzzz/Zzzzzz_v0.0.0/res, -M, /home/expert/Downloads/Zzzzzz/Zzzzzz_v0.0.0/AndroidManifest.xml]
```
* Generate keys to sign apk: `keytool -genkey -alias keys -keystore keys -keyalg RSA -keysize 2048 -validity 10000 # password`
* Sign apk file: `jarsigner -verbose -keystore keys /home/expert/Downloads/lancet/flixster_patched.apk keys`
* If necessary convert apk to jar for further analysis: `d2j-dex2jar.sh net.flixster.android-9.1.3@APK4Fun.com.apk`
* To find what cyphers suites are supported by remote server calls: `nmap --script ssl-enum-ciphers -p 443 youtubei.googleapis.com` or `sslscan youtubei.googleapis.com`
* To check what cypher suites your client supports query https://www.howsmyssl.com/a/check



> Check the other cheat sheet if stuck in the `APIS` folder ( local )