import os
import ast

def convert_same_to_one(same_probs_list):
    """Converts list of dicts (sameProbs) to list of lists (oneProbs)."""
    one_probs = []
    for entry in same_probs_list:
        one_probs.append(list(entry.values()))
    return one_probs

def process_file_pair(same_path, one_path):
    try:
        with open(same_path, 'r') as f:
            same_probs = ast.literal_eval(f.read())
        one_probs = convert_same_to_one(same_probs)
        with open(one_path, 'w') as f:
            f.write(str(one_probs))
        print(f"✅ Wrote {one_path}")
    except Exception as e:
        print(f"⚠️ Error processing {same_path}: {e}")

def find_and_process_all(base_dir='./public/data'):
    for root, dirs, files in os.walk(base_dir):
        for fname in files:
            if fname.startswith("sameProbs") and fname.endswith(".txt"):
                same_path = os.path.join(root, fname)
                one_fname = fname.replace("sameProbs", "oneProbs")
                one_path = os.path.join(root, one_fname)

                if os.path.exists(one_path):
                    print(f"🔁 Skipping existing: {one_path}")
                else:
                    process_file_pair(same_path, one_path)

if __name__ == "__main__":
    find_and_process_all()
