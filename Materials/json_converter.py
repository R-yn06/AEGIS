import csv
import json
from pathlib import Path

def convert_csvs_to_json(input_directory: str, output_filepath: str) -> None:
    """
    Scans a directory for CSV files, parses them, and compiles them 
    into a single JSON file organized by filename.
    """
    # Dictionary to hold the final aggregated data
    compiled_data = {}
    
    # Define the path to the directory
    dir_path = Path(input_directory)
    
    # Ensure the directory exists to avoid errors
    if not dir_path.is_dir():
        print(f"Error: The directory '{input_directory}' does not exist.")
        return

    # Iterate through all .csv files in the folder
    for csv_file in dir_path.glob('*.csv'):
        filename = csv_file.stem  # Gets the filename without the '.csv' extension
        file_records = []
        
        # Read the CSV file
        with open(csv_file, mode='r', encoding='utf-8-sig') as f:
            # DictReader automatically maps the first row (headers) to dictionary keys
            reader = csv.DictReader(f)
            for row in reader:
                file_records.append(row)
        
        # Assign the list of records to the filename key in our main dictionary
        compiled_data[filename] = file_records
        print(f"Processed: {csv_file.name} ({len(file_records)} records)")

    # Write the compiled data out to a JSON file
    with open(output_filepath, mode='w', encoding='utf-8') as json_f:
        # indent=4 makes the JSON file human-readable and nicely formatted
        json.dump(compiled_data, json_f, indent=4)
        
    print(f"\nSuccess! All data successfully written to {output_filepath}")

if __name__ == "__main__":
    # Based on your VS Code explorer, your folder name is likely '25LH0051'
    # Adjust this path if the script is running from a different directory
    INPUT_FOLDER = "C:\\Users\\Ralf\\OneDrive\\Documents\\GitHub\\AEGIS\\Materials\\25LB0036" 
    OUTPUT_JSON_FILE = "compiled_materials_data.json"
    
    convert_csvs_to_json(INPUT_FOLDER, OUTPUT_JSON_FILE)