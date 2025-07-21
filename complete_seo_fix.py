#!/usr/bin/env python3
import os
import re
import glob

def remove_keywords_from_file(file_path):
    """Remove keywords line from markdown frontmatter"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Pattern to match keywords line in frontmatter
        pattern = r'^keywords:\s*\[.*?\]\s*\n'
        new_content = re.sub(pattern, '', content, flags=re.MULTILINE | re.DOTALL)
        
        # Also handle multi-line keywords arrays
        pattern_multiline = r'^keywords:\s*\[\s*\n.*?\]\s*\n'
        new_content = re.sub(pattern_multiline, '', new_content, flags=re.MULTILINE | re.DOTALL)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ Removed keywords from: {file_path}")
            return True
        return False
            
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def check_tsx_file_seo(file_path):
    """Check SEO elements in TSX files"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        print(f"📄 Checking TSX: {file_path}")
        
        # Check for meta tags
        has_title = 'title' in content or '<title>' in content
        has_description = 'description' in content or 'meta name="description"' in content
        has_og_tags = 'og:' in content
        has_twitter = 'twitter:' in content
        
        print(f"  Title: {'✅' if has_title else '❌'}")
        print(f"  Description: {'✅' if has_description else '❌'}")
        print(f"  Open Graph: {'✅' if has_og_tags else '❌'}")
        print(f"  Twitter Cards: {'✅' if has_twitter else '❌'}")
        
        return {
            'has_title': has_title,
            'has_description': has_description,
            'has_og_tags': has_og_tags,
            'has_twitter': has_twitter
        }
        
    except Exception as e:
        print(f"❌ Error checking {file_path}: {e}")
        return None

def improve_md_seo(file_path):
    """Improve SEO for markdown files"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if not in repos directory or is README
        if 'repos/' not in file_path or 'README.md' in file_path:
            return False
        
        # Determine project and canonical URL
        project_name = None
        base_url = None
        
        if 'laravel-like-docs' in file_path:
            project_name = 'laravel-like-docs'
            base_url = 'https://docs.cslant.com/laravel-like'
        elif 'github-project-php-docs' in file_path:
            project_name = 'github-project-php-docs'
            base_url = 'https://docs.cslant.com/github-project-php'
        elif 'telegram-git-notifier-docs' in file_path:
            project_name = 'telegram-git-notifier-docs'
            base_url = 'https://docs.cslant.com/telegram-git-notifier'
        else:
            return False
        
        # Extract title and description
        title_match = re.search(r'^title:\s*(.+)$', content, re.MULTILINE)
        desc_match = re.search(r'^description:\s*(.+)$', content, re.MULTILINE)
        
        if not title_match:
            return False
        
        title = title_match.group(1).strip().strip('"\'')
        description = desc_match.group(1).strip().strip('"\'') if desc_match else ""
        
        # Generate canonical URL
        relative_path = file_path.replace(f'repos/{project_name}/', '').replace('.md', '')
        canonical_url = f"{base_url}/{relative_path}"
        
        # Truncate description if too long
        if len(description) > 160:
            description = description[:157] + "..."
        
        # Check if already has comprehensive head section
        if all(tag in content for tag in ['<head>', 'canonical', 'og:title', 'twitter:card']):
            return False
        
        # Find head section or create one
        head_start = content.find('<head>')
        head_end = content.find('</head>')
        
        if head_start != -1 and head_end != -1:
            # Replace existing head
            new_head = f'''<head>
  <meta name="robots" content="index,follow" />
  <meta name="author" content="CSlant" />
  <link rel="canonical" href="{canonical_url}" />
  
  {{/* Open Graph tags */}}
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{description}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="{canonical_url}" />
  
  {{/* Twitter Card tags */}}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{title}" />
  <meta name="twitter:description" content="{description}" />
</head>'''
            
            new_content = content[:head_start] + new_head + content[head_end + 7:]
        else:
            # Add head section after frontmatter
            frontmatter_end = content.find('---', 3)
            if frontmatter_end != -1:
                frontmatter_end = content.find('\n', frontmatter_end) + 1
                
                new_head = f'''
<head>
  <meta name="robots" content="index,follow" />
  <meta name="author" content="CSlant" />
  <link rel="canonical" href="{canonical_url}" />
  
  {{/* Open Graph tags */}}
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{description}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="{canonical_url}" />
  
  {{/* Twitter Card tags */}}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{title}" />
  <meta name="twitter:description" content="{description}" />
</head>

'''
                
                new_content = content[:frontmatter_end] + new_head + content[frontmatter_end:]
            else:
                return False
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✅ Enhanced SEO for: {file_path}")
        return True
        
    except Exception as e:
        print(f"❌ Error enhancing {file_path}: {e}")
        return False

def main():
    print("🚀 COMPLETE SEO OPTIMIZATION - STARTING FROM SCRATCH")
    print("=" * 60)
    
    base_dir = '/Users/tannguyen/Data/CSlant/source/docs'
    
    # Step 1: Remove keywords from all MD files
    print("\n📝 STEP 1: Removing keywords from markdown files...")
    md_files_with_keywords = []
    
    for root, dirs, files in os.walk(base_dir):
        # Skip node_modules
        if 'node_modules' in root:
            continue
            
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if 'keywords:' in content:
                            md_files_with_keywords.append(file_path)
                except:
                    continue
    
    print(f"Found {len(md_files_with_keywords)} MD files with keywords")
    
    keywords_removed = 0
    for file_path in md_files_with_keywords:
        if remove_keywords_from_file(file_path):
            keywords_removed += 1
    
    print(f"✅ Removed keywords from {keywords_removed} files")
    
    # Step 2: Check TSX files
    print("\n🔍 STEP 2: Checking TSX files for SEO...")
    tsx_files = []
    
    for root, dirs, files in os.walk(base_dir):
        if 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.tsx'):
                tsx_files.append(os.path.join(root, file))
    
    print(f"Found {len(tsx_files)} TSX files")
    
    tsx_seo_stats = {'total': 0, 'with_title': 0, 'with_desc': 0, 'with_og': 0, 'with_twitter': 0}
    
    for tsx_file in tsx_files:
        result = check_tsx_file_seo(tsx_file)
        if result:
            tsx_seo_stats['total'] += 1
            if result['has_title']: tsx_seo_stats['with_title'] += 1
            if result['has_description']: tsx_seo_stats['with_desc'] += 1
            if result['has_og_tags']: tsx_seo_stats['with_og'] += 1
            if result['has_twitter']: tsx_seo_stats['with_twitter'] += 1
    
    # Step 3: Improve MD files SEO
    print("\n🎯 STEP 3: Enhancing SEO for markdown files...")
    
    md_files_to_improve = []
    repos_dir = os.path.join(base_dir, 'repos')
    for root, dirs, files in os.walk(repos_dir):
        for file in files:
            if file.endswith('.md') and file != 'README.md':
                file_path = os.path.join(root, file)
                # Skip telegram-git-notifier source files
                if 'telegram-git-notifier/docs' not in file_path and 'telegram-git-notifier/CHANGELOG.md' not in file_path:
                    md_files_to_improve.append(file_path)
    
    print(f"Found {len(md_files_to_improve)} MD files to enhance")
    
    enhanced_count = 0
    for file_path in md_files_to_improve:
        if improve_md_seo(file_path):
            enhanced_count += 1
    
    # Final report
    print("\n" + "=" * 60)
    print("📊 FINAL SEO OPTIMIZATION REPORT")
    print("=" * 60)
    print(f"✅ Keywords removed from: {keywords_removed} files")
    print(f"✅ SEO enhanced for: {enhanced_count} markdown files")
    print(f"\n📱 TSX Files Analysis:")
    print(f"  Total TSX files: {tsx_seo_stats['total']}")
    print(f"  With titles: {tsx_seo_stats['with_title']}")
    print(f"  With descriptions: {tsx_seo_stats['with_desc']}")
    print(f"  With Open Graph: {tsx_seo_stats['with_og']}")
    print(f"  With Twitter Cards: {tsx_seo_stats['with_twitter']}")
    
    print(f"\n🎉 SEO optimization completed!")

if __name__ == "__main__":
    main()
