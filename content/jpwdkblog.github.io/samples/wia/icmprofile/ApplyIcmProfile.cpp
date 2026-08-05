// ApplyIcmProfile.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <windows.h>
#include <iostream>
#include <tchar.h>
#include <icm.h>
#include <stireg.h>

// TODO: Change this to your device's friendly name
#define YOUR_IMAGINGDEVICE_FRIENDLY_NAME _T("Extended WIA Monster Device")

// Imaging class GUID and registry path
#define IMAGING_CLASS_GUID       _T("{6BDD1FC6-810F-11D0-BEC7-08002BE2092F}")
#define IMAGING_CLASS_REGPATH    _T("System\\CurrentControlSet\\Control\\Class\\") IMAGING_CLASS_GUID
#define COLOR_PROFILE_PATH       _T("\\spool\\drivers\\color\\")

// Function prototypes
BOOL FindDeviceIdAndIcmProfilePath(
    LPTSTR  pszTargetFriendlyName,
    LPTSTR* ppszDeviceId,
    LPTSTR* ppszIcmProfilePath);

/// <summary>
/// main entry point
/// </summary>
/// <returns></returns>
int main()
{
    LPTSTR pszDeviceID       = NULL;
    LPTSTR pszIcmProfilePath = NULL;

#ifdef _DEBUG
    MessageBox(NULL, _T("You can attach remote debugger at this point"), _T("ApplyIcmProfile"), MB_OK);
#endif

    std::cout << "Start: ApplyIcmProfile\n";

    // Find the DeviceID and IcmProfile path for the specified device friendly name
    if (!FindDeviceIdAndIcmProfilePath((LPTSTR)YOUR_IMAGINGDEVICE_FRIENDLY_NAME, &pszDeviceID, &pszIcmProfilePath))
    {
        std::cout << "Could not find the specified imaging device\n";
        goto cleanup;
    }

    // Install the color profile
    std::cout << "Installing color profile...\n";
    if (!InstallColorProfile(NULL, pszIcmProfilePath))
    {
        std::cout << "InstallColorProfile failed: " << GetLastError() << "\n";
        goto cleanup;
    }
    std::cout << "Successfully installed color profile\n";

    // Associate the color profile with the device
    std::cout << "Associating color profile with device...\n";
    if (!WcsAssociateColorProfileWithDevice(WCS_PROFILE_MANAGEMENT_SCOPE_SYSTEM_WIDE, pszIcmProfilePath, pszDeviceID))
    {
        std::cout << "WcsAssociateColorProfileWithDevice failed: " << GetLastError() << "\n";
        goto cleanup;
    }
    std::cout << "Successfully associated color profile with device\n";

cleanup:
    if (pszIcmProfilePath)
        LocalFree(pszIcmProfilePath);

    if (pszDeviceID)
        LocalFree(pszDeviceID);

    return 0;
}

/// <summary>
/// Searches the Windows registry for an imaging device with a specified friendly name and retrieves its device ID and the full path to its ICM (color profile) file.
/// </summary>
/// <param name="pszTargetFriendlyName">A pointer to a string containing the friendly name (or substring) of the target imaging device to search for.</param>
/// <param name="ppszDeviceId">A pointer to a variable that receives a pointer to the allocated string containing the device ID of the found device. The caller is responsible for freeing this memory.</param>
/// <param name="ppszIcmProfilePath">A pointer to a variable that receives a pointer to the allocated string containing the full path to the ICM profile of the found device. The caller is responsible for freeing this memory.</param>
/// <returns>Returns TRUE if a device matching the specified friendly name is found and both the device ID and ICM profile path are successfully retrieved; otherwise, returns FALSE.</returns>
BOOL FindDeviceIdAndIcmProfilePath(
    LPTSTR  pszTargetFriendlyName,
    LPTSTR* ppszDeviceId,
    LPTSTR* ppszIcmProfilePath)
{
    LONG   lRet;
    HKEY   hKey = NULL;
    DWORD  dwIndex;
    BOOL   bFound = FALSE;
    TCHAR  szDeviceIndex[32];
    TCHAR  szSystemDir[MAX_PATH] = { 0 };
    TCHAR  szIcmProfile[MAX_PATH] = { 0 };
    size_t cchLength;

    // Open the registry key for the Imaging device class
    lRet = RegOpenKeyEx(
                HKEY_LOCAL_MACHINE,
                IMAGING_CLASS_REGPATH,
                0,
                KEY_READ,
                &hKey);
    if (lRet != ERROR_SUCCESS)
        goto cleanup;

    for (dwIndex = 0; !bFound; dwIndex++)
    {
        DWORD dwType,
              dwSize;
        HKEY  hSubkey = NULL;
        TCHAR szFriendlyName[512];

        dwSize = ARRAYSIZE(szDeviceIndex);
        ZeroMemory(szDeviceIndex, sizeof(szDeviceIndex));

        // Enumerate the subkeys (device instances) of the Imaging class key
        lRet = RegEnumKeyEx(
                    hKey,
                    dwIndex,
                    szDeviceIndex,
                    &dwSize, // cchName
                    NULL,    // reserved
                    NULL,    // lpClass
                    NULL,    // lpcClass
                    NULL);   // lpftLastWriteTime
        if (lRet != ERROR_SUCCESS)
            break;
        std::cout << "Found Imaging Device at index: " << dwIndex << "\n";

        // Open the subkey for this device instance
        lRet = RegOpenKeyEx(
                    hKey,
                    szDeviceIndex,
                    0,
                    KEY_READ,
                    &hSubkey);
        if (lRet != ERROR_SUCCESS)
            break;

        // Get the FriendlyName value
        dwSize = sizeof(szFriendlyName);
        ZeroMemory(szFriendlyName, sizeof(szFriendlyName));

        lRet = RegQueryValueEx(
                    hSubkey,
                    L"FriendlyName",
                    NULL,
                    &dwType,
                    (LPBYTE)szFriendlyName,
                    &dwSize);
        if (lRet == ERROR_SUCCESS && dwType == REG_SZ)
        {
            std::wcout << L" FriendlyName: " << szFriendlyName << "\n";

            // Check if this is the device we are looking for
            if (_tcsstr(szFriendlyName, pszTargetFriendlyName) != NULL)
            {
                // We found the device, now get the IcmProfile value
                dwSize = sizeof(szIcmProfile);
                ZeroMemory(szIcmProfile, sizeof(szIcmProfile));

                lRet = RegQueryValueEx(
                            hSubkey,
                            _T("IcmProfiles"),
                            NULL,
                            &dwType,
                            (LPBYTE)szIcmProfile,
                            &dwSize);
                if (lRet == ERROR_SUCCESS && dwType == REG_SZ)
                {
                    std::wcout << L" Found IcmProfile: " << szIcmProfile << "\n";

                    // Now get the DeviceID value
                    dwSize = 0;
                    lRet = RegQueryValueExW(
                        hSubkey,
                        _T("DeviceID"),
                        NULL,
                        &dwType,
                        NULL,
                        &dwSize);
                    if (lRet == ERROR_SUCCESS)
                    {
                        // Allocate memory for the DeviceID string
                        *ppszDeviceId = (LPTSTR)LocalAlloc(LPTR, dwSize);
                        lRet = RegQueryValueExW(
                            hSubkey,
                            _T("DeviceID"),
                            NULL,
                            &dwType,
                            (LPBYTE)*ppszDeviceId,
                            &dwSize);
                        std::wcout << L" DeviceID: " << *ppszDeviceId << "\n";

                        bFound = TRUE;
                    }
                }
            }
        }
        if (hSubkey)
        {
            RegCloseKey(hSubkey);
            hSubkey = NULL;
        }
    }

    // If we found the device, construct the full path to the ICM profile
    cchLength = GetSystemDirectory(szSystemDir, MAX_PATH);
    cchLength += _tcslen(COLOR_PROFILE_PATH);
    cchLength += _tcslen(szIcmProfile) + 1;

    *ppszIcmProfilePath = (LPTSTR)LocalAlloc(LPTR, sizeof(TCHAR) * cchLength);
    if (*ppszIcmProfilePath == NULL) {
        std::wcerr << L"Memory allocation failed for IcmProfilePath\n";

        bFound = FALSE;
        goto cleanup;
    }
    _tcscpy_s(*ppszIcmProfilePath, cchLength, szSystemDir);
    _tcscat_s(*ppszIcmProfilePath, cchLength, COLOR_PROFILE_PATH);
    _tcscat_s(*ppszIcmProfilePath, cchLength, szIcmProfile);
    std::wcout << L" Full IcmProfilePath: " << *ppszIcmProfilePath << "\n";

cleanup:
    if (hKey)
        RegCloseKey(hKey);

    return bFound;
}